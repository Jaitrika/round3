import os
import subprocess
from pathlib import Path
import sys, types
import requests
from pathlib import Path
from google.cloud import texttospeech

# Create a fake module called "pyaudioop" (since pydub tries to import it)
fake_audioop = types.SimpleNamespace(
    mul=lambda *a, **k: b"",
    add=lambda *a, **k: b"",
    reverse=lambda *a, **k: b"",
)
# Register it in sys.modules so import pyaudioop works
sys.modules["pyaudioop"] = fake_audioop
sys.modules["audioop"] = fake_audioop
from pydub import AudioSegment
AudioSegment.converter = "/opt/homebrew/bin/ffmpeg"

def _generate_local_tts(text, output_file, voice=None):
    """Generate audio using local TTS implementation (espeak-ng command line).
    
    Supports one speaker. For multi-speaker conversations, use
    `generate_conversation_tts`.
    """
    espeak_voice = voice or os.getenv("ESPEAK_VOICE", "en")
    espeak_speed = os.getenv("ESPEAK_SPEED", "125")

    temp_wav_file = output_file.replace('.mp3', '.wav')

    try:
        cmd = [
            'espeak-ng',
            '-v', espeak_voice,
            '-s', str(espeak_speed),
            '-w', temp_wav_file,
            text
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)

        if result.returncode != 0:
            raise RuntimeError(f"espeak-ng failed: {result.stderr}")

        if not os.path.exists(temp_wav_file):
            raise RuntimeError(f"espeak-ng did not create output file {temp_wav_file}")

        if output_file.endswith('.mp3'):
            audio = AudioSegment.from_wav(temp_wav_file)
            audio.export(output_file, format="mp3")
            os.remove(temp_wav_file)
        else:
            os.rename(temp_wav_file, output_file)

        print(f"Local TTS audio saved to: {output_file}")
        return output_file

    except subprocess.TimeoutExpired:
        raise RuntimeError("espeak-ng synthesis timed out")
    except FileNotFoundError:
        raise RuntimeError("espeak-ng is not installed. Install it:\n"
                           "Ubuntu/Debian: sudo apt-get install espeak-ng\n"
                           "macOS: brew install espeak\n"
                           "CentOS/RHEL: sudo yum install espeak-ng")
    except Exception as e:
        raise RuntimeError(f"Local TTS synthesis error: {str(e)}")
    

def generate_conversation_tts(conversation, output_file):
    """
    Generate a multi-speaker conversation podcast.

    Args:
        conversation: list of dicts with {"text": "...", "voice": "..."}
        output_file: final mp3/wav output file
    """
    if not conversation:
        raise ValueError("Conversation list is empty. Cannot generate TTS.")

    segments = []

    for i, turn in enumerate(conversation):
        text = turn["text"]
        voice = turn["voice"]
        temp_file = f"temp_speaker_{i}.wav"

        try:
            _generate_local_tts(text, temp_file, voice)
            segments.append(AudioSegment.from_wav(temp_file))
        except Exception as e:
            print(f"Error generating TTS for turn {i}: {e}")
        finally:
            if os.path.exists(temp_file):
                os.remove(temp_file)

    if not segments:
        raise RuntimeError("No valid audio segments were generated. Check the conversation input.")

    final_audio = segments[0]
    for segment in segments[1:]:
        final_audio += segment

    if output_file.endswith(".mp3"):
        final_audio.export(output_file, format="mp3")
    else:
        final_audio.export(output_file, format="wav")

    print(f"Conversation TTS saved to: {output_file}")
    return output_file

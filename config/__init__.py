# Config package
from .settings import SETTINGS, get_setting, set_setting, get_app_path
from .prompts import SYSTEM_PROMPT, get_prompt

__all__ = ['SETTINGS', 'get_setting', 'set_setting', 'get_app_path', 'SYSTEM_PROMPT', 'get_prompt']
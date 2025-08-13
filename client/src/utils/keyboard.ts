import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  callback: () => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = (shortcut.ctrlKey ?? false) === event.ctrlKey;
        const metaMatches = (shortcut.metaKey ?? false) === event.metaKey;
        const shiftMatches = (shortcut.shiftKey ?? false) === event.shiftKey;

        if (keyMatches && ctrlMatches && metaMatches && shiftMatches) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.callback();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function useGlobalKeyboardShortcuts() {
  const [, setLocation] = useLocation();

  useKeyboardShortcuts([
    {
      key: '/',
      callback: () => {
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
    },
    {
      key: 'k',
      metaKey: true,
      callback: () => {
        // TODO: Open command palette
        console.log('Command palette opened');
      },
    },
    {
      key: '?',
      callback: () => {
        // TODO: Open chat copilot
        console.log('Chat copilot toggled');
      },
    },
    {
      key: 'g',
      callback: () => {
        // TODO: Open Jira form
        console.log('Jira form opened');
      },
    },
    {
      key: 'e',
      callback: () => {
        // TODO: Execute action
        console.log('Execute action triggered');
      },
    },
  ]);
}

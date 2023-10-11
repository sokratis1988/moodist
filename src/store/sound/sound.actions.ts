import type { StateCreator } from 'zustand';

import type { SoundState } from './sound.state';

export interface SoundActions {
  select: (id: string) => void;
  unselect: (id: string) => void;
  setVolume: (id: string, volume: number) => void;
  unselectAll: (pushToHistory?: boolean) => void;
  restoreHistory: () => void;
}

export const createActions: StateCreator<
  SoundActions & SoundState,
  [],
  [],
  SoundActions
> = (set, get) => {
  return {
    restoreHistory() {
      const history = get().history;

      if (!history) return;

      set({ history: null, sounds: history });
    },

    select(id) {
      set({
        history: null,
        sounds: {
          ...get().sounds,
          [id]: { ...get().sounds[id], isSelected: true },
        },
      });
    },

    setVolume(id, volume) {
      set({
        sounds: {
          ...get().sounds,
          [id]: { ...get().sounds[id], volume },
        },
      });
    },

    unselect(id) {
      set({
        sounds: {
          ...get().sounds,
          [id]: { ...get().sounds[id], isSelected: false },
        },
      });
    },

    unselectAll(pushToHistory = false) {
      const noSelected = get().noSelected();

      if (noSelected) return;

      const sounds = get().sounds;

      if (pushToHistory) {
        const history = JSON.parse(JSON.stringify(sounds));
        set({ history });
      }

      const ids = Object.keys(sounds);

      ids.forEach(id => {
        sounds[id].isSelected = false;
        sounds[id].volume = 0.5;
      });

      set({ sounds });
    },
  };
};

import { useRxData } from 'rxdb-hooks';
import { type Settings } from '@/stores/schemas/settings';

export function useSettings(): [
    Settings | null,
    (settings: Partial<Settings>) => void,
] {
    const { result } = useRxData<Settings>('settings', (settings) =>
        settings.findOne('settings')
    );
    return [
        result[0],
        (settings: Partial<Settings>) => {
            void result[0]?.incrementalPatch(settings);
        },
    ];
}

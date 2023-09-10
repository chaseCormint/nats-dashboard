import {
  createSignal,
  createMemo,
  createEffect,
  Show,
  Switch,
  Match,
} from 'solid-js';

import { useJsz } from '~/lib/queries';
import { useStore } from '~/components/context/store';
import GetStarted from '~/components/dashboard/GetStarted';
import { LoadingIcon } from '~/components/icons';

import JetStreamInfo from './JetStreamInfo';
import JetStreamStats from './JetStreamStats';
import AccountTabs from './AccountTabs';
import AccountInfo from './AccountInfo';
import StreamsList from './StreamsList';

export default function JetStream() {
  const [store] = useStore();
  const jsz = useJsz(() => ({
    accounts: true,
    streams: true,
    consumers: true,
  }));

  const [selected, setSelected] = createSignal<string | undefined>();

  const account = createMemo(
    () => jsz.data?.account_details?.find((a) => a.id === selected())
  );

  createEffect(() => {
    // Select the first account in the list when we get the data
    // and don't have an account selected.
    if (selected() === undefined && jsz.isSuccess) {
      setSelected(jsz.data.account_details?.[0]?.id);
    }
  });

  return (
    <div>
      <Switch>
        <Match when={!store.active && jsz.isPending}>
          <GetStarted />
        </Match>

        <Match when={store.active && jsz.isLoading}>
          <div class="flex items-center justify-center h-40 px-4 py-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white">
            <LoadingIcon class="h-5 w-5" />
          </div>
        </Match>

        <Match when={jsz.isSuccess}>
          <JetStreamInfo jsz={jsz} />
          <JetStreamStats jsz={jsz} />

          <Show when={(jsz.data?.account_details?.length ?? 0) > 0}>
            <AccountTabs
              accounts={jsz.data?.account_details!}
              active={selected()!}
              onChange={setSelected}
              numStreams={true} // TODO: Set to false when streams are not fetched.
            />
          </Show>

          <Show when={account()}>
            <AccountInfo account={account()!} />
          </Show>

          <Show when={account()}>
            <StreamsList account={account()!} />
          </Show>
        </Match>
      </Switch>
    </div>
  );
}

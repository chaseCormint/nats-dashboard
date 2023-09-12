import { createSignal, Switch, Match } from 'solid-js';

import type { FormattedStreamDetail } from '~/lib/format';
import { Tabs, Tab, TabPanel } from '~/components/Tabs';
import { SlideOverContent } from '~/components/SlideOver';
import InfoList from '~/components/dashboard/InfoList';
import DataList from '~/components/dashboard/DataList';

import StreamConfig from './StreamConfig';

interface Props {
  stream: FormattedStreamDetail;
}

export default function StreamDetails(props: Props) {
  const [tab, setTab] = createSignal(0);
  const updateTab = (i: number) => (e: Event) => {
    e.preventDefault();
    setTab(i);
  };

  return (
    <>
      <Tabs>
        <Tab active={tab() === 0} onClick={updateTab(0)}>
          Info
        </Tab>
        <Tab active={tab() === 1} onClick={updateTab(1)}>
          Config
        </Tab>
      </Tabs>

      <SlideOverContent>
        <Switch>
          <Match when={tab() === 0}>
            <TabPanel>
              <div class="space-y-6">
                <InfoList
                  info={{
                    Name: props.stream.name,
                    Type: props.stream.info.label,
                    Created: props.stream.info.created,
                  }}
                />

                <DataList
                  title="State"
                  data={{
                    Consumers: props.stream.info.state.consumerCount,
                    Subjects: props.stream.info.state.numSubjects.str,
                    Messages: props.stream.info.state.messages.str,
                    'Data Size': props.stream.info.state.data.str,
                    'Num. Deleted': props.stream.info.state.numDeleted.str,
                    'First Sequence':
                      props.stream.info.state.messages.num > 0
                        ? props.stream.info.state.firstSeq
                        : undefined,
                    'Last Sequence':
                      props.stream.info.state.messages.num > 0
                        ? props.stream.info.state.lastSeq
                        : undefined,
                    'First Timestamp':
                      props.stream.info.state.messages.num > 0
                        ? props.stream.info.state.firstTS
                        : undefined,
                    'Last Timestamp':
                      props.stream.info.state.messages.num > 0
                        ? props.stream.info.state.lastTS
                        : undefined,
                  }}
                />

                <DataList
                  title="Cluster"
                  data={{
                    Name: props.stream.cluster?.name,
                    Leader: props.stream.cluster?.leader,
                    Replicas: props.stream.cluster?.replicas?.length,
                  }}
                />
              </div>
            </TabPanel>
          </Match>

          <Match when={tab() === 1}>
            <TabPanel>
              <Switch>
                <Match when={props.stream.config}>
                  <StreamConfig config={props.stream.config!} />
                </Match>
                <Match when={!props.stream.config}>
                  <p>
                    Fetching configuration must be enabled to display the stream
                    config.
                  </p>
                </Match>
              </Switch>
            </TabPanel>
          </Match>
        </Switch>
      </SlideOverContent>
    </>
  );
}

import { Show } from 'solid-js';

import { useVarz } from '~/lib/queries';
import {
  formatBytes,
  abbreviateNum,
  durationFromNs,
  abbreviateObjectValues,
} from '~/lib/utils';
import DataCard from '~/components/DataCard';

export default function InfoCards() {
  const varz = useVarz();

  return (
    <div class="px-4 py-8 sm:px-6 lg:px-8 tabular-nums slashed-zero">
      <div class="space-y-8 sm:space-y-0 sm:grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
        <div class="flex flex-col gap-8">
          <DataCard
            title="Server"
            data={{
              Host: varz.data?.host,
              Port: varz.data?.port,
              'Protocol Version': varz.data?.proto,
              Version: varz.data?.version,
              JetStream: varz.data?.info.jsEnabled ? 'Enabled' : 'Disabled',
              Cores: varz.data?.cores,
              GOMAXPROCS: varz.data?.gomaxprocs,
              'Auth. Required': varz.data?.auth_required ? 'Yes' : 'No',
              'Go Version': varz.data?.go,
              'Git Commit': varz.data?.git_commit,
              'System Account': varz.data?.system_account,
            }}
          />

          <Show when={varz.data?.info.leafEnabled}>
            <DataCard
              title="Leaf Node"
              data={{
                Host: varz.data?.leaf?.host,
                Port: varz.data?.leaf?.port,
                'Auth. Timeout': `${varz.data?.leaf?.auth_timeout}s`,
                'TLS Required': varz.data?.leaf?.tls_required ? 'Yes' : 'No',
                'TLS Timeout': `${varz.data?.leaf?.tls_timeout}s`,
              }}
            />
          </Show>
        </div>

        <Show when={varz.data?.info.jsEnabled}>
          <div class="flex flex-col gap-8">
            <DataCard
              title="JetStream Stats"
              data={{
                Memory: formatBytes(varz.data?.jetstream?.stats?.memory ?? 0)
                  .str,
                'Reserved Memory': formatBytes(
                  varz.data?.jetstream?.stats?.reserved_memory ?? 0
                ).str,
                Storage: formatBytes(varz.data?.jetstream?.stats?.storage ?? 0)
                  .str,
                'Reserved Storage': formatBytes(
                  varz.data?.jetstream?.stats?.reserved_storage ?? 0
                ).str,
                Accounts: varz.data?.jetstream?.stats?.accounts,
                'HA Assets': varz.data?.jetstream?.stats?.ha_assets,
                'API Total': abbreviateNum(
                  varz.data?.jetstream?.stats?.api.total ?? 0
                ).str,
                'API Errors': abbreviateNum(
                  varz.data?.jetstream?.stats?.api.errors ?? 0
                ).str,
              }}
            />

            <DataCard
              title="JetStream Config"
              data={{
                'Max Memory': formatBytes(
                  varz.data?.jetstream?.config?.max_memory ?? 0
                ).str,
                'Max Storage': formatBytes(
                  varz.data?.jetstream?.config?.max_storage ?? 0
                ).str,
                'Store Directory': varz.data?.jetstream?.config?.store_dir,
                'Sync Always':
                  varz.data?.jetstream?.config?.sync_always !== undefined
                    ? varz.data?.jetstream?.config?.sync_always
                      ? 'Yes'
                      : 'No'
                    : undefined,
                'Sync Interval': varz.data?.jetstream?.config?.sync_interval
                  ? durationFromNs(varz.data?.jetstream?.config?.sync_interval)
                      .str
                  : undefined,
                'Compression Allowed': varz.data?.jetstream?.config?.compress_ok
                  ? 'Yes'
                  : 'No',
              }}
            />
          </div>
        </Show>

        <Show
          when={
            varz.data?.slow_consumer_stats ||
            varz.data?.info.wsEnabled ||
            varz.data?.info.mqttEnabled
          }
        >
          <div class="flex flex-col gap-8">
            <Show when={varz.data?.slow_consumer_stats}>
              <DataCard
                title="Slow Consumer Stats"
                data={{
                  Clients: varz.data?.slow_consumer_stats?.clients,
                  Routes: varz.data?.slow_consumer_stats?.routes,
                  Gateways: varz.data?.slow_consumer_stats?.gateways,
                  Leafs: varz.data?.slow_consumer_stats?.leafs,
                }}
              />
            </Show>

            <Show when={varz.data?.info.wsEnabled}>
              <DataCard
                title="WebSocket"
                data={{
                  Host: varz.data?.websocket?.host,
                  Port: varz.data?.websocket?.port,
                  TLS:
                    varz.data?.websocket?.no_tls !== undefined
                      ? varz.data?.websocket?.no_tls
                        ? 'Disabled'
                        : 'Enabled'
                      : undefined,
                  'No Auth. User': varz.data?.websocket?.no_auth_user,
                  'Handshake Timeout':
                    varz.data?.websocket?.handshake_timeout !== undefined
                      ? durationFromNs(
                          varz.data?.websocket?.handshake_timeout ?? 0
                        ).str
                      : undefined,
                  Compression:
                    varz.data?.websocket?.compression !== undefined
                      ? varz.data?.websocket?.compression
                        ? 'Enabled'
                        : 'Disabled'
                      : undefined,
                }}
              />
            </Show>

            <Show when={varz.data?.info.mqttEnabled}>
              <DataCard
                title="MQTT"
                data={{
                  Host: varz.data?.mqtt?.host,
                  Port: varz.data?.mqtt?.port,
                  'No Auth. User': varz.data?.mqtt?.no_auth_user,
                  'TLS Timeout': `${varz.data?.mqtt?.tls_timeout}s`,
                  'ACK Wait': durationFromNs(varz.data?.mqtt?.ack_wait ?? 0)
                    .str,
                  'Max ACK Pending': formatBytes(
                    varz.data?.mqtt?.max_ack_pending ?? 0
                  ).str,
                }}
              />
            </Show>
          </div>
        </Show>

        <div class="flex flex-col gap-8">
          <DataCard
            title="Monitoring Server"
            data={{
              Host: varz.data?.http_host,
              'HTTP Port': varz.data?.http_port,
              'HTTPS Port': varz.data?.https_port,
              'Base Path': varz.data?.http_base_path || '/',
            }}
          />
          <DataCard
            title="HTTP Request Stats"
            data={abbreviateObjectValues(varz.data?.http_req_stats) ?? {}}
          />
        </div>
      </div>
    </div>
  );
}

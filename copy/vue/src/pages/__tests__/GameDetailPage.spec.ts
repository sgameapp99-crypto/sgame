import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, reactive } from 'vue';
import { beforeEach, afterEach, describe, expect, test, vi, type MockedFunction } from 'vitest';
import GameDetailPage from '../GameDetailPage.vue';
import { gamesAPI } from '../../api';

const routeStub = reactive({
  query: {} as Record<string, unknown>,
  params: { id: 'GAME-DETAIL-1' } as Record<string, unknown>,
  fullPath: '/games/detail/GAME-DETAIL-1',
});

const routerPush = vi.fn();
const routerReplace = vi.fn();
const routerLinkStub = { template: '<a><slot /></a>' };

vi.mock('vue-router', () => ({
  useRoute: () => routeStub,
  useRouter: () => ({
    push: routerPush,
    replace: routerReplace,
  }),
  RouterLink: defineComponent({
    name: 'RouterLink',
    props: {
      to: {
        type: [String, Object],
        default: () => '#',
      },
    },
    setup(props, { slots }) {
      return () =>
        h('a', { href: typeof props.to === 'string' ? props.to : '#' }, slots.default?.());
    },
  }),
}));

const flushPromises = async () => {
  await nextTick();
  await nextTick();
};

const mockGame = {
  gameId: 'GAME-DETAIL-1',
  allianceId: 1,
  allianceName: 'MLB',
  sportType: 'baseball',
  gameDate: '2025-11-01',
  gameTime: '19:05',
  status: 'finished' as const,
  homeTeam: { id: 1, name: '洛杉磯道奇', pitcher: 'Kershaw' },
  awayTeam: { id: 2, name: '舊金山巨人', pitcher: 'Webb' },
  internationalOdds: {
    spread: {
      home: { line: '-1.5', odds: '1.90' },
      away: { line: '+1.5', odds: '1.90' },
    },
    total: {
      over: { line: '8.5', odds: '1.85' },
      under: { line: '8.5', odds: '1.95' },
    },
  },
  taiwanOdds: {
    spread: {
      home: { line: '-1.5', odds: '1.85' },
      away: { line: '+1.5', odds: '1.95' },
    },
    moneyline: {
      home: { odds: '1.60' },
      away: { odds: '2.30' },
    },
    total: {
      over: { line: '8.5', odds: '1.85' },
      under: { line: '8.5', odds: '1.95' },
    },
  },
  finalScore: { home: 4, away: 2 },
};

let getGameMock: MockedFunction<typeof gamesAPI.getGame>;

describe('GameDetailPage', () => {
  beforeEach(() => {
    routerPush.mockReset();
    routerReplace.mockReset();
    routeStub.query = { alliance: '1', date: '2025-11-01', page: '1' };
    routeStub.params = { id: 'GAME-DETAIL-1' };
    routeStub.fullPath = '/games/detail/GAME-DETAIL-1';

    getGameMock = vi.spyOn(gamesAPI, 'getGame').mockResolvedValue({
      success: true,
      data: mockGame,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders game detail information', async () => {
    const wrapper = mount(GameDetailPage, {
      global: {
        stubs: {
          RouterLink: routerLinkStub,
        },
      },
    });
    await flushPromises();

    expect(getGameMock).toHaveBeenCalledWith('GAME-DETAIL-1');
    expect(wrapper.text()).toContain('洛杉磯道奇');
    expect(wrapper.text()).toContain('舊金山巨人');
    expect(wrapper.text()).toContain('2-4');
    expect(wrapper.text()).toContain('前往購買預測');
  });

  test('displays error message when API request fails', async () => {
    getGameMock.mockRejectedValueOnce(new Error('Network error'));

    const wrapper = mount(GameDetailPage, {
      global: {
        stubs: {
          RouterLink: routerLinkStub,
        },
      },
    });
    await flushPromises();

    expect(wrapper.text()).toContain('載入賽事詳情失敗');
  });
});

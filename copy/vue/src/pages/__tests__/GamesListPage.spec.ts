import { mount } from '@vue/test-utils';
import { reactive, defineComponent, h, nextTick } from 'vue';
import { beforeEach, afterEach, describe, expect, test, vi, type MockedFunction } from 'vitest';
import GamesListPage from '../games/GamesListPage.vue';
import { gamesAPI } from '../../api';

const routeStub = reactive({
  query: {} as Record<string, unknown>,
  params: {} as Record<string, unknown>,
  fullPath: '/games/list',
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

const mockGames = [
  {
    gameId: 'GAME-1',
    allianceId: 1,
    allianceName: 'MLB',
    sportType: 'baseball',
    gameDate: '2025-11-01',
    gameTime: '19:05',
    status: 'scheduled',
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
    finalScore: null,
  },
  {
    gameId: 'GAME-2',
    allianceId: 3,
    allianceName: '日本職棒',
    sportType: 'baseball',
    gameDate: '2025-11-01',
    gameTime: '17:30',
    status: 'finished',
    homeTeam: { id: 3, name: '阪神虎', pitcher: '村上' },
    awayTeam: { id: 4, name: '讀賣巨人', pitcher: '菅野' },
    internationalOdds: {
      spread: {
        home: { line: '-1.5', odds: '2.05' },
        away: { line: '+1.5', odds: '1.75' },
      },
      total: {
        over: { line: '7.0', odds: '1.90' },
        under: { line: '7.0', odds: '1.90' },
      },
    },
    taiwanOdds: {
      spread: {
        home: { line: '-1.5', odds: '2.05' },
        away: { line: '+1.5', odds: '1.75' },
      },
      moneyline: {
        home: { odds: '1.90' },
        away: { odds: '1.90' },
      },
      total: {
        over: { line: '7.0', odds: '1.90' },
        under: { line: '7.0', odds: '1.90' },
      },
    },
    finalScore: { home: 5, away: 3 },
  },
];

let getGamesMock: MockedFunction<typeof gamesAPI.getGames>;

describe('GamesListPage', () => {
  beforeEach(() => {
    routerPush.mockReset();
    routerReplace.mockReset();
    routeStub.query = { date: '2025-11-01' };
    routeStub.params = {};
    routeStub.fullPath = '/games/list';

    getGamesMock = vi.spyOn(gamesAPI, 'getGames').mockResolvedValue({
      success: true,
      data: mockGames,
      pagination: { page: 1, size: 20, total: mockGames.length },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders games returned by API', async () => {
    const wrapper = mount(GamesListPage, {
      global: {
        stubs: {
          RouterLink: routerLinkStub,
        },
      },
    });
    await flushPromises();

    expect(gamesAPI.getGames).toHaveBeenCalledWith(
      expect.objectContaining({ date: '2025-11-01', page: 1 }),
    );
    const rows = wrapper.findAll('.games-table tbody tr');
    expect(rows).toHaveLength(2);
    expect(wrapper.text()).toContain('洛杉磯道奇');
    expect(wrapper.text()).toContain('阪神虎');
  });

  test('changing page triggers router replace with updated query', async () => {
    getGamesMock.mockResolvedValueOnce({
      success: true,
      data: mockGames,
      pagination: { page: 1, size: 20, total: 40 },
    });

    const wrapper = mount(GamesListPage, {
      global: {
        stubs: {
          RouterLink: routerLinkStub,
        },
      },
    });
    await flushPromises();

    const buttons = wrapper.findAll('.pagination__btn');
    expect(buttons).toHaveLength(2);
    const nextBtn = buttons[1];
    expect(nextBtn.attributes('disabled')).toBeUndefined();

    await nextBtn.trigger('click');

    expect(routerReplace).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({ page: '2', date: '2025-11-01' }),
      }),
    );
  });
});

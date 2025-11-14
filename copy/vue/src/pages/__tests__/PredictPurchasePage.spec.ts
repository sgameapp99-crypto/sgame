import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { reactive, defineComponent, h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import PredictPurchasePage from '../PredictPurchasePage.vue';
import { useSessionStore } from '../../stores/session';
import { predictionsAPI, coinsAPI } from '../../api';

const routeStub = reactive({
  query: {} as Record<string, unknown>,
  params: {} as Record<string, unknown>,
  fullPath: '/predict/buy',
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

const mockPredictions = [
  {
    id: 1,
    userId: 101,
    userName: '高手 A',
    userAvatarUrl: '',
    gameId: 'GAME001',
    gameInfo: {
      allianceId: 1,
      allianceName: 'MLB',
      sportType: 'baseball',
      gameDate: '2025-10-10',
      gameTime: '19:00',
      homeTeam: '洛杉磯道奇',
      awayTeam: '舊金山巨人',
      finalScore: null,
    },
    predictionType: 'taiwan_total',
    predictionTypeLabel: '運彩盤大小',
    selection: 'over',
    selectionLabel: '大分',
    odds: '1.85',
    price: 200,
    isMainPick: true,
    note: '道奇打線近期火燙',
    status: 'pending',
    isPurchased: false,
    isOwn: false,
    purchaseCount: 5,
    createdAt: '2025-10-09T10:00:00Z',
    updatedAt: '2025-10-09T10:00:00Z',
  },
  {
    id: 2,
    userId: 102,
    userName: '高手 B',
    userAvatarUrl: '',
    gameId: 'GAME002',
    gameInfo: {
      allianceId: 3,
      allianceName: '日本職棒',
      sportType: 'baseball',
      gameDate: '2025-10-10',
      gameTime: '17:30',
      homeTeam: '阪神虎',
      awayTeam: '橫濱海灣之星',
      finalScore: null,
    },
    predictionType: 'taiwan_spread',
    predictionTypeLabel: '運彩盤讓分',
    selection: 'home',
    selectionLabel: '主隊',
    odds: '1.95',
    price: 0,
    isMainPick: false,
    note: null,
    status: 'pending',
    isPurchased: false,
    isOwn: false,
    purchaseCount: 0,
    createdAt: '2025-10-09T11:00:00Z',
    updatedAt: '2025-10-09T11:00:00Z',
  },
];

const mockCoinInfo = {
  success: true,
  accountId: 'ACC-1',
  balance: 500,
  earned: 1000,
  spent: 500,
};

describe('PredictPurchasePage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    routerPush.mockReset();
    routerReplace.mockReset();
    routeStub.query = {};
    routeStub.params = {};
    routeStub.fullPath = '/predict/buy';

    vi.spyOn(predictionsAPI, 'getPredictions').mockResolvedValue({
      success: true,
      data: mockPredictions,
      pagination: { page: 1, size: 50, total: mockPredictions.length },
    });

    vi.spyOn(coinsAPI, 'getCoinInfo').mockResolvedValue(mockCoinInfo);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders predictions from API', async () => {
    const session = useSessionStore();
    session.loggedIn = true;
    session.userId = '999';

    const wrapper = mount(PredictPurchasePage, {
      global: {
        stubs: {
          RouterLink: routerLinkStub,
        },
      },
    });
    await flushPromises();

    expect(predictionsAPI.getPredictions).toHaveBeenCalledTimes(1);
    expect(wrapper.findAll('.prediction-card')).toHaveLength(2);
    expect(wrapper.text()).toContain('共 2 筆預測');
    expect(wrapper.text()).toContain('目前榮譽點：');
  });

  test('redirects to login when purchasing without session', async () => {
    const session = useSessionStore();
    session.loggedIn = false;

    const wrapper = mount(PredictPurchasePage, {
      global: {
        stubs: {
          RouterLink: routerLinkStub,
        },
      },
    });
    await flushPromises();

    const purchaseButton = wrapper.find('.btn-purchase');
    expect(purchaseButton.exists()).toBe(true);

    await purchaseButton.trigger('click');

    expect(routerPush).toHaveBeenCalledWith({ name: 'login', query: { redirect: '/predict/buy' } });
  });
});

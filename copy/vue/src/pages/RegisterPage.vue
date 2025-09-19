<template>
  <div class="container mx-auto px-lg py-xl">
    <div class="heading-2">會員註冊</div>
    <form
      class="card mt-md space-y-md"
      method="post"
      action="https://www.playsport.cc/member/register"
    >
      <div>
        <label class="block text-sm text-neutral-700">帳號</label>
        <input class="input w-full" name="username" required autocomplete="username" />
      </div>
      <div>
        <label class="block text-sm text-neutral-700">Email</label>
        <input class="input w-full" type="email" name="email" required autocomplete="email" />
      </div>
      <div>
        <label class="block text-sm text-neutral-700">密碼</label>
        <input
          class="input w-full"
          type="password"
          name="password"
          required
          autocomplete="new-password"
        />
      </div>
      <div>
        <label class="block text-sm text-neutral-700">確認密碼</label>
        <input
          class="input w-full"
          type="password"
          name="password_confirm"
          required
          autocomplete="new-password"
        />
      </div>
      <input type="hidden" name="redirect" :value="redirectUrl" />
      <div class="flex gap-sm">
        <button class="btn btn-primary" type="submit">註冊</button>
        <RouterLink class="btn btn-outline" :to="{ name: 'login' }">已有帳號？去登入</RouterLink>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const redirectUrl = computed(() => `${window.location.origin}/`);
</script>




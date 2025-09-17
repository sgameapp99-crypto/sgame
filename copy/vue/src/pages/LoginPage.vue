<template>
	<div class="min-h-screen flex flex-col">
		<AppHeader />
		<div class="flex-1 flex justify-center items-start p-6">
			<form action="https://www.playsport.cc/member/auth" method="post" class="w-[360px] bg-white border border-neutral-200 rounded-lg p-4">
				<h2 class="heading-2 mb-3">登入</h2>
				<div class="mb-3">
					<label for="userid">帳號</label>
					<input id="userid" name="username" type="text" required class="input mt-1" />
				</div>
				<div class="mb-3">
					<label for="password">密碼</label>
					<input id="password" name="password" type="password" minlength="6" required class="input mt-1" />
				</div>
				<div class="flex items-center gap-2 mb-3">
					<input id="rememberme" name="rememberme" type="checkbox" value="yes" checked />
					<label for="rememberme">記住我</label>
				</div>
				<input type="hidden" name="redirectUrl" :value="redirectUrl" />
				<div class="flex gap-2 items-center">
					<button type="submit" class="btn-primary">登入</button>
					<RouterLink to="/register" class="btn-outline">免費加入會員</RouterLink>
				</div>
			</form>
		</div>
		<AppFooter />
	</div>
</template>
<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { ref, onMounted } from 'vue';

const redirectUrl = ref('');
onMounted(() => {
	redirectUrl.value = window.location.origin + '/';
});
</script>

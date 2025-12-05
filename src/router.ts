import { createRouter, createWebHistory } from "vue-router";

// https://router.vuejs.org/guide/advanced/lazy-loading.html#Lazy-Loading-Routes
const routes = [
	{
		path: "/",
		component: () => import("@/modules/authentication/pages/login.vue"),
	},
	{
		path: "/sample",
		component: () => import("@/modules/authentication/pages/sample.vue"),
	},
	{
		path: "/su",
		component: () => import("@/components/layouts/superuser.vue"),
		children: [
			{
				path: "",
				component: () => import("@/modules/dashboard/pages/superuser.vue"),
			},
			{
				path: "tickets",
				component: () => import("@/modules/tickets/pages/index.vue"),
			},
			{
				path: "tickets/create",
				component: () => import("@/modules/tickets/pages/create.vue"),
			},
		],
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});

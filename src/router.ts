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
		name: "Dashboard",
		component: () => import("@/components/layouts/superuser.vue"),
		children: [
			{
				path: "",
				component: () => import("@/modules/dashboard/pages/superuser.vue"),
			},
			{
				path: "tickets",
				name: "Tickets", 
				redirect:"/su/tickets",
				children: [
					{
						path: "create",
						name: "File Ticket",
						component: () => import("@/modules/tickets/pages/create.vue"),
					},
					{
						path: "reported",
						name: "My Tickets",
						component: () => import("@/modules/tickets/pages/reported.vue"),
					},
					{
						path: "assigned",
						name: "Assigned Tickets",
						component: () => import("@/modules/tickets/pages/assigned.vue"),
					},
					{
						path: "",
						name: "All Tickets",
						component: () => import("@/modules/tickets/pages/index.vue"),
					},
				]
			}, 
		],
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});

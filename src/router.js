import { createWebHistory, createRouter } from "vue-router";

const route = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/digitalBoard",
            name: "home",
            component: () => import("./components/HomePage.vue")
        }
    ]
})

export default route;
import { createWebHistory, createRouter } from "vue-router";

const route = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/digitalBoard',
            name: 'home',
            component: () => import("./components/HomePage.vue")
        },
        {
            path: '/digitalBoard/selectedTopics',
            name: 'card',
            component: () => import("./components/SelectedTopic.vue")
        }
    ]
})

export default route;
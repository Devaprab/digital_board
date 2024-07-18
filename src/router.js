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
        },
        {
            path: '/digitalBoard/detailsPage',
            name: 'detailsPage',
            component: () => import("./components/MainPage.vue")
        },
        {
            path: '/digitalBoard/detailsPage/firstSub',
            name: 'subPage',
            component: () => import("./components/FirstSubPage.vue")
        },
        {
            path: '/digitalBoard/detailsPage/secondSub',
            name: 'sub2Page',
            component: () => import("./components/SecondSubPage.vue")
        }
    ],
    scrollBehavior(_, _2, savedPosition) {
        if (savedPosition) {
          return savedPosition;
        }
        return { left: 0, top: 0 };
      },
})

export default route;
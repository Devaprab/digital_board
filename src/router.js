import { createWebHistory, createRouter } from "vue-router";

const route = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/digitalBoard',
            name: 'home',
            component: () => import("./components/horizontal/HomePage.vue")
        },
        {
            path: '/digitalBoard/selectedTopics',
            name: 'card',
            component: () => import("./components/horizontal/SelectedTopic.vue")
        },
        {
            path: '/digitalBoard/detailsPage',
            name: 'detailsPage',
            component: () => import("./components/horizontal/MainPage.vue")
        },
        {
            path: '/digitalBoard/detailsPage/firstSub',
            name: 'subPage',
            component: () => import("./components/horizontal/FirstSubPage.vue")
        },
        {
            path: '/digitalBoard/detailsPage/secondSub',
            name: 'sub2Page',
            component: () => import("./components/horizontal/SecondSubPage.vue")
        },
        {
            path: '/digitalBoard/portrait',
            name: 'home-portrait',
            component: () => import("./components/vertical/HomePage.vue")
        },
        {
            path: '/digitalBoard/selectedTopics/portrait',
            name: 'card-portrait',
            component: () => import("./components/vertical/SelectedTopic.vue")
        },
        {
            path: '/digitalBoard/detailsPage/portrait',
            name: 'detailsPage-portrait',
            component: () => import("./components/vertical/MainPage.vue")
        },
        {
            path: '/digitalBoard/detailsPage/firstSub/portrait',
            name: 'subPage-portrait',
            component: () => import("./components/vertical/FirstSubPage.vue")
        },
        {
            path: '/digitalBoard/detailsPage/secondSub/portrait',
            name: 'sub2Page-portrait',
            component: () => import("./components/vertical/SecondSubPage.vue")
        },
        {
            path: '/digitalBoard/detailsPage/demo',
            name: 'sub3Page-portrait',
            component: () => import("./components/vertical/DemoPage.vue")
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
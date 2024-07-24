import {configureStore, combineReducers} from '@reduxjs/toolkit'
import userReducer from './userSlice.js'
import videoReducer from './videoSlice.js'
import adminReducer from './adminSlice.js'  // 导入新的 adminReducer
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {PersistGate} from 'redux-persist/integration/react'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    user: userReducer,
    video: videoReducer,
    admin: adminReducer  // 添加 adminReducer 到 rootReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export const persistor = persistStore(store);

// 存储目录
// -- user
// ---- currentUser, loading, error
// -- video
// -- admin
// ---- currentAdmin, loading, error
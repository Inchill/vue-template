import Mock from 'mockjs'
import msgList from './data/msg-list'

Mock.mock(/v1\/getPosts/, msgList)

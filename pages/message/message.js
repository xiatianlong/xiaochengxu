import common from '../../resource/js/common';
//获取应用实例
var app = getApp();
// pages/message/message.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        dataList: [],
        textareaInputValue: '',
        textareaInputLength: 0,
        hasMore: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
        //调用应用实例的方法获取全局数据
        wx.request({
            url: common.commentInitAndMoreUrl,
            method: "POST",
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.result == 'success') {
                        that.setData({
                            dataList: res.data.infos,
                            hasMore: res.data.hasMore
                        })
                    } else {
                        app.showToast(res.data.message);
                    }
                }
            },
            fail: function () {
                app.showToast("请求异常");
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        var that = this;
        wx.showNavigationBarLoading();
        //调用应用实例的方法获取全局数据
        wx.request({
            url: common.commentInitAndMoreUrl,
            method: "POST",
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.result == 'success') {
                        that.setData({
                            dataList: res.data.infos,
                            hasMore: res.data.hasMore
                        })
                    } else {
                        app.showToast(res.data.message);
                    }
                }
            },
            fail: function () {
                app.showToast("请求异常");
            },
            complete: function () {
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            }
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (!this.data.hasMore) {
            wx.showToast({
                title: '没有更多数据了...',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        wx.showNavigationBarLoading();
        var dataList = this.data.dataList;
        var that = this;
        //调用应用实例的方法获取全局数据
        wx.request({
            url: common.commentInitAndMoreUrl,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                commentId: dataList[dataList.length - 1].commentId
            },
            method: "POST",
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.result == 'success') {
                        that.setData({
                            dataList: dataList.concat(res.data.infos),
                            hasMore: res.data.hasMore
                        });
                    } else {
                        app.showToast(res.data.message);
                    }
                }
            },
            fail: function () {
                app.showToast("请求异常...");
            },
            complete: function () {
                wx.hideNavigationBarLoading()
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        if (e.detail.userInfo) {
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            })
        }
    },
    textareaInput: function (e) {
        this.setData({
            textareaInputLength: e.detail.cursor,
            textareaInputValue: e.detail.value
        })
    },
    submitComment: function () {
        var that = this;
        if (!that.data.textareaInputValue) {
            app.showToast("请输入留言内容");
        }
        wx.showNavigationBarLoading();

        var requestData = {};
        console.log(that.data.userInfo);
        if (JSON.stringify(that.data.userInfo) != "{}") {
            requestData = {
                commentContent: that.data.textareaInputValue,
                commentName: that.data.userInfo.nickName,
                commentArea: that.data.userInfo.province + '-' + that.data.userInfo.city,
                commentHeadImg: that.data.userInfo.avatarUrl,
                commentSex: that.data.userInfo.gender === 1 ? '男' : '女'
            }
        } else {
            requestData = {
                commentContent: that.data.textareaInputValue,
                commentName: '',
                commentArea: '',
                commentHeadImg: '',
                commentSex: ''
            }
        }

        wx.request({
            url: common.commentAddUrl,
            method: "POST",
            data: requestData,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.result == 'success') {
                        // 在数组最前面插入对象
                        if (that.data.dataList != null && that.data.dataList.length > 0) {
                            that.data.dataList.unshift(res.data.info);
                        } else {
                            let tempArr = new Array();
                            tempArr[0] = res.data.info;
                            that.data.dataList = tempArr;
                        }

                        that.setData({
                            dataList: that.data.dataList,
                            textareaInputValue: '',
                            textareaInputLength: 0
                        })
                        wx.showToast({
                            icon: 'success',
                            title: '留言成功'
                        })
                    } else {
                        app.showToast(res.data.message);
                    }
                }
            },
            fail: function () {
                app.showToast("请求异常");
            },
            complete: function () {
                wx.hideNavigationBarLoading();
            }
        })
    }
})
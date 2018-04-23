import common from '../..//resource/js/common';
//获取应用实例
var app = getApp();
// pages/article/list.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        dataList: {},
        imgUrls: [],
        hasMore: true,
        searchClearIcon: 'hide',
        searchInputValue: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        //调用应用实例的方法获取全局数据
        wx.request({
            url: common.homeUrl,
            method: "GET",
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.result == 'success') {
                        that.setData({
                            dataList: res.data.articleNoteReviewPassedCards,
                            imgUrls: res.data.bannerList,
                            hasMore: res.data.hasMore
                        });
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
            url: common.homeQueryUrl,
            method: "POST",
            data: {
                keyword: that.data.searchInputValue
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.result == 'success') {
                        that.setData({
                            dataList: res.data.articleNoteReviewPassedCards,
                            hasMore: res.data.hasMore
                        });
                        wx.stopPullDownRefresh();
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
                wx.stopPullDownRefresh()
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
            url: common.homeQueryUrl,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                orderKey: dataList[dataList.length - 1].orderKey,
                keyword: that.data.searchInputValue
            },
            method: "POST",
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.result == 'success') {
                        that.setData({
                            dataList: dataList.concat(res.data.articleNoteReviewPassedCards),
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

    /**
     * 监听输入框-》控制clearicon的显示以及对文本框数据的填充
     */
    listenerInput: function (e) {
        this.setData({
            searchInputValue: e.detail.value
        });
        if (e.detail.value.length > 0) {
            this.setData({
                searchClearIcon: 'show'
            });
        } else {
            this.setData({
                searchClearIcon: 'hide'
            });
        }
    },

    /**
     * 清空文本框
     */
    clearInputValue: function () {
        this.setData({
            searchInputValue: '',
            searchClearIcon: 'hide'
        });
    },

    /**
     * 搜索提交
     */
    searchSubmit: function (e) {
        wx.showLoading({
            title: '搜索中...',
        });
        var that = this;
        //调用应用实例的方法获取全局数据
        wx.request({
            url: common.homeQueryUrl,
            data: {
                keyword: that.data.searchInputValue
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.result == 'success') {
                        that.setData({
                            dataList: res.data.articleNoteReviewPassedCards,
                            hasMore: res.data.hasMore
                        });
                        wx.hideLoading();
                    } else {
                        app.showToast(res.data.message);
                    }
                }
            },
            fail: function () {
                app.showToast("请求异常...");
            }
        })
    },
    // 去详情页
    goDetail: function (e) {
        var id = e.currentTarget.dataset.bizId;
        var bizType = e.currentTarget.dataset.bizType;
        var url = '../articleDetail/articleDetail?id=' + id;
        if (bizType === 'note') {
            url = '../noteDetail/noteDetail?id=' + id;
        }
        wx.navigateTo({
            url: url
        });
    }
})
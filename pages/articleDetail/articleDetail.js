import common from '../../resource/js/common';

var WxParse = require('../../wxParse/wxParse.js');
// pages/articleDetail/articleDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var bizId = options.id;
        var that = this;
        //调用应用实例的方法获取全局数据
        wx.request({
            url: common.domin + '/article/' + bizId,
            method: "GET",
            success: function (res) {
                if (res.statusCode == 200) {
                    console.log(res)
                    if (res.data.result == 'success') {
                        that.setData({
                            data: res.data.articleInfo
                        });
                        WxParse.wxParse('article', 'html', res.data.articleInfo.articleContent, that, 5);
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            complete: function () {
                                wx.navigateBack()
                            }
                        })
                    }
                }
            },
            fail: function () {
                wx.showToast({
                    title: '请求异常',
                    icon: 'none',
                    complete: function () {
                        wx.navigateBack()
                    }
                })
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
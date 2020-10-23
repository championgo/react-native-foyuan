export default {
  user: {
    auth: "frontApi/login",
    weixin: "frontApi/wx_login",
    phoneLogin: 'frontApi/sms_login',
    checkEmail: "user/checkEmail",
    fillEmail: "user/fillEmail",
    resetPassword: "frontApi/forget_password",
    signUp: "frontApi/app_register",
    checkForgetUser: "frontApi/check_mobile",
    checkCode: "frontApi/confirm_code",
    checkMobile: "frontApi/check_mobile",
  },
  author: {
    posts: "frontApi/api/blogs/<%=blogger%>/posts?pageIndex=<%=pageIndex%>"
  },
  home: {
    index: "frontApi/class/getBookingList",
    listPlateHome: 'frontApi/home/listPlate',
    meauList: 'frontApi/home/menu/list', // 首页导航列表
    listPlate: 'frontApi/home/menu/listPlate', // 首页导航列表详情
    getBanner: 'frontApi/getBanner', // 主页banner
    couponList: 'frontApi/home/coupon/list', // 首页优惠券列表
    getCoupon: 'frontApi/home/coupon/get', // 领取优惠券
    seckillList: "frontApi/home/seckill/list", // 首页秒杀列表
  },
  mine: {
    index: "frontApi/center/user_center",
    changename: "frontApi/center/update_nickname",
    changeimg: 'adminApi/img/upload',
    update_avatar: 'frontApi/center/update_avatar',
    verify_code: "laravel-sms/verify-code",
    check_mobile: "frontApi/check_mobile",
    check_has_mobile: 'frontApi/check_has_mobile',
    check_phone: "laravel-sms/verify-code",
    bindPhone: "frontApi/center/bindPhone",
    address: 'frontApi/center/address/index',
    address_store: "frontApi/center/address/store",
    address_index: 'frontApi/center/address/index',
    address_delete: 'frontApi/center/address/delete',
    address_update: 'frontApi/center/address/update',
    feedback: 'frontApi/center/feedback/store',
    giftcard: "frontApi/center/giftcard/getTotal",
    getExchange: 'frontApi/center/giftcard/getExchange',
    getGiftCard: 'frontApi/center/giftcard/getGiftCard',
    getTransaction: 'frontApi/center/giftcard/getTransaction',
    invoice: 'frontApi/center/invoice/index',
    invoice_detail: 'frontApi/center/invoice/show',
    getProjectOrder: 'frontApi/center/invoice/getInvoiceProduct',
    addInvoiceList: 'frontApi/center/invoice/addInvoice',
    bindWeixin:'frontApi/center/bindWeixin',
    orderdetails:'frontApi/center/order/show/',   //订单详情
    orderList: "frontApi/center/orderList", // 订单列表
    orderRemind: "frontApi/center/order/remind", // 提醒发货
    orderBuyAgain: "frontApi/center/order/addCart", // 再次购买
    orderConfirm: "frontApi/center/order/confirm", // 确认收货
    orderCancle: "frontApi/center/order/cancelAuto", // 自动取消订单
    nopaydelete: "frontApi/center/order/nopaydelete",//删除取消的订单
    cancelManual: "frontApi/center/order/cancelManual",//手动取消订单
    after: "frontApi/center/return/show", //退换售后
    deteteupload: "adminApi/img/delete",//删除上传图片
    aftersubmission: "frontApi/center/order/cancel_pay", //待发货退换售后提交
    postReturn: 'frontApi/center/return/postReturn', //待收货待评价售后提交
    getReview: 'frontApi/center/order/getReview', //商品评价
    postreview: 'frontApi/center/order/postreview',//评价提交
    getTraces: 'frontApi/center/return/getTraces', //售后进度
    getShippingPacke:'frontApi/center/order/getShippingPackeges', //追踪物流
    couponsproductslist:'frontApi/center/coupons_products_list',//优惠券去使用跳转
    orderPay: "frontApi/center/order/pay" // 支付
  },
  // 首页更多里面商品列表
  homemore: {
    index: "frontApi/home/menu/detailPlate",
    commoditydetail: "frontApi/product/show", // 商品详情
    productshowreview: "frontApi/product/getComments", // 商品详情展示评论
    collect: "frontApi/product/collect",// 收藏
    productselection: "frontApi/product/get_property/", // 商品详情规格选择
    joinshopping: "frontApi/cart/add",  // 加入购物车
    orderinfo: "frontApi/order/order_info", // 订单结算
    getGroup: 'frontApi/product/getGroup',//商品详情组合套餐
    getGroupList: 'frontApi/product/getGroupList',//商品详情组合套餐列表
    chooseGroup: 'frontApi/product/chooseGroup', //商品详情组合套餐列表数量加减
    showProduct: "frontApi/home/seckill/showProduct", //秒杀商品详情 
    getProperty: 'frontApi/home/seckill/getProperty', //秒杀商品规格选择
    couponslist: 'frontApi/center/couponslist', //我的优惠券
    receiveCoupon: 'frontApi/center/receiveCoupon', //兑换优惠券
    showProduct: "frontApi/home/seckill/showProduct", //秒杀商品详情 
    getProperty: 'frontApi/home/seckill/getProperty', //秒杀商品规格选择
    getComments:'frontApi/product/getComments', //商品详情里面的全部评论
  },
  recommend: {
    record: 'frontApi/product/recommend',// 购物车里面的为你推荐商品
    changename: "frontApi/center/update_nickname",
    changeimg: 'adminApi/img/upload',
    update_avatar: 'frontApi/center/update_avatar',
    verify_code: "laravel-sms/verify-code",
    check_mobile: "frontApi/check_mobile",
    check_has_mobile: 'frontApi/check_has_mobile',
    check_phone: "laravel-sms/verify-code",
    bindPhone: "frontApi/center/bindPhone",
    address: 'frontApi/center/address/index',
    address_store: "frontApi/center/address/store",
    address_index: 'frontApi/center/address/index',
    address_delete: 'frontApi/center/address/delete',
    address_update: 'frontApi/center/address/update',
    shoppinglist: "frontApi/cart/list",
    numberchange: 'frontApi/cart/edit',
    batch: 'frontApi/cart/batch_choose',
    empty_cart: 'frontApi/cart/empty_cart',
    deleteing: 'frontApi/cart/delete'
  },
  search: {
    hotKeyWord: 'frontApi/search/hotKeyWord',
    search: "frontApi/search/index",
  },
  shop: {
    get_shop: 'frontApi/product/get_shop',
    get_list: 'frontApi/product/list',
    labelList:'frontApi/product/label_list',
  },
  sort: { // 分类
    category_list: 'frontApi/product/category_list',
    getRecommend: '/frontApi/shop/getRecommend',
  }
};

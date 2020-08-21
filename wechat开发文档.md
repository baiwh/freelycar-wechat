## 微信端接口

### 1.用户端
### 2.技术端
### 3.公用组件
#### 1.URL对应发送的请求
##### 1.扫码 
* url:https://www.freelycar.com/wechat/role-select/{柜子ID}
* 请求+参数：
a.获取个人信息 /wechat/config/getWeChatUserInfo {code}
b.获取网点信息 /wechat/ark/getArkInfo {arkSn/柜子码}
c.获取技师是否开通智能柜  /wechat/staff/isCurrentArk {staffId/技师Id}
d.更新技师网点信息   /wechat/employee/selectStore {employeeId&defaultStoreId/技师ID&网点ID}
e.更新用户网点信息   /wechat/wxuser/chooseDefaultStore {id&defaultStoreID/用户ID&柜子ID}
f.获取订单状态 /wechat/order/listOrders{clintId&arkSn}


#### 2.login
* url:https://www.freelycar.com/wechat/login
* 请求+参数
a.获取验证码 /wechat/login/getSmsCode?phone='{手机号}
b.

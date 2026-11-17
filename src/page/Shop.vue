<template>
<div class="page">

  <!-- 商城顶部 -->
  <div class="shop-top">
    <p>健康商城</p>

    <div class="cart" @click="showCart">
      购物车
      <span v-if="cartCount > 0">
        {{ cartCount }}
      </span>
    </div>
  </div>

  <div class="content">

    <!-- 搜索 -->
    <div class="search">
      <el-input
        v-model="search"
        placeholder="搜索健康商品"
        clearable
      />
    </div>

    <!-- 商品分类 -->
    <div class="category">

      <div class="itemTitle">
        <p>商品分类</p>
      </div>

      <el-row
        :gutter="10"
        style="padding: 10px;width: 100%;box-sizing: border-box;"
      >

        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
          v-for="(item,index) in categories"
          :key="index"
        >

          <div
            class="category-item"
            :class="{ selected: currentCategory === item.name }"
            @click="selectCategory(item.name)"
          >

            <p class="category-name">
              {{ item.name }}
            </p>

            <p class="category-subtitle">
              {{ item.subtitle }}
            </p>

          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 商品区域 -->
    <div class="goods">

      <div class="goods-title">
        <p>
          {{
            currentCategory === '全部'
            ? '热门商品'
            : currentCategory
          }}
        </p>
      </div>

      <el-row
        :gutter="10"
        style="padding: 10px;width: 100%;box-sizing: border-box;"
      >

        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
          v-for="(item,index) in filteredGoods"
          :key="index"
        >

          <div class="goods-item">

            <!-- 浅蓝色商品信息框 -->
            <div class="goods-img">

              <p class="goods-name">
                {{ item.name }}
              </p>

              <p class="goods-subtitle">
                {{ item.subtitle }}
              </p>

            </div>

            <!-- 价格和加购按钮 -->
            <div class="goods-bottom">

              <span class="price">
                价格：{{ item.price }}
              </span>

              <el-button
                size="small"
                @click="addCart(item)"
              >
                加购
              </el-button>

            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 没有商品 -->
      <div
        class="empty"
        v-if="filteredGoods.length === 0"
      >

        <p>没有找到相关商品</p>

        <el-button
          size="small"
          @click="resetGoods"
        >
          查看全部商品
        </el-button>

      </div>
    </div>
  </div>

  <!-- 购物车 -->
  <el-drawer
    v-model="cartVisible"
    title="我的购物车"
    direction="rtl"
    size="90%"
  >

    <div
      class="cart-content"
      v-if="cartList.length > 0"
    >

      <div
        class="cart-item"
        v-for="item in cartList"
        :key="item.id"
      >

        <!-- 商品名称和价格 -->
        <div class="cart-item-info">

          <p class="cart-item-name">
            {{ item.name }}
          </p>

          <p class="cart-item-price">
            价格：{{ item.price }}
          </p>

        </div>

        <!-- 商品数量 -->
        <div class="cart-number">

          <el-button
            size="small"
            @click="decrease(item)"
          >
            -
          </el-button>

          <span>
            {{ item.count }}
          </span>

          <el-button
            size="small"
            @click="increase(item)"
          >
            +
          </el-button>

        </div>

        <!-- 删除商品 -->
        <div class="cart-delete">

          <el-button
            type="danger"
            size="small"
            @click="deleteCart(item.id)"
          >
            删除
          </el-button>

        </div>

      </div>

      <!-- 合计 -->
      <div class="cart-total">

        <div class="total-info">

          <p>
            共 {{ cartCount }} 件商品
          </p>

          <p>
            合计：{{ totalPrice.toFixed(2) }}
          </p>

        </div>

        <el-button
          class="checkout-button"
          @click="checkout"
        >
          立即结算
        </el-button>

      </div>

    </div>

    <!-- 空购物车 -->
    <div
      class="cart-empty"
      v-else
    >

      <p>购物车还是空的</p>

      <el-button
        @click="cartVisible = false"
      >
        去选购商品
      </el-button>

    </div>

  </el-drawer>

  <!-- 底部导航 -->
  <div
    class="bottom"
    style="
      height: 10vh;
      width: 100vw;
      text-align: center;
      background-color: #127A90;
      position: fixed;
      bottom: 0;
      box-sizing: border-box;
    "
  >

    <el-row
      :gutter="10"
      style="
        padding: 10px;
        width: 100%;
        box-sizing: border-box;
      "
    >

      <el-col
        :xs="6"
        :sm="8"
        :md="8"
        :lg="8"
        :xl="8"
        v-for="(item,index) in navs"
        :key="index"
        @click="item.path && router.push(item.path)"
      >

        <div
          class="nav-item"
          style="height: 10vh;"
        >

          <img :src="item.img">

          {{ item.title }}

        </div>

      </el-col>

    </el-row>

  </div>

</div>
</template>

<script setup>

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 搜索内容
const search = ref('')

// 当前分类
const currentCategory = ref('全部')

// 是否显示购物车
const cartVisible = ref(false)

// 购物车商品
const cartList = ref([])

// 商品分类
const categories = [

  {
    name: '家庭常备',
    subtitle: '家庭日常常备用品'
  },

  {
    name: '清洁防护',
    subtitle: '日常清洁防护用品'
  },

  {
    name: '运动健康',
    subtitle: '运动锻炼辅助用品'
  },

  {
    name: '生活护理',
    subtitle: '日常生活护理用品'
  }

]

// 商品数据
const goods = [

  {
    id: 1,
    name: '创可贴',
    subtitle: '日常小伤口护理',
    category: '家庭常备',
    price: 9.9
  },

  {
    id: 2,
    name: '医用棉签',
    subtitle: '家庭常用护理用品',
    category: '家庭常备',
    price: 12.9
  },

  {
    id: 3,
    name: '日常防护口罩',
    subtitle: '日常出行防护用品',
    category: '清洁防护',
    price: 19.9
  },

  {
    id: 4,
    name: '消毒湿巾',
    subtitle: '日常清洁方便携带',
    category: '清洁防护',
    price: 15.9
  },

  {
    id: 5,
    name: '运动护膝',
    subtitle: '运动时保护膝部',
    category: '运动健康',
    price: 39.9
  },

  {
    id: 6,
    name: '弹力训练带',
    subtitle: '日常拉伸训练用品',
    category: '运动健康',
    price: 29.9
  },

  {
    id: 7,
    name: '蒸汽眼罩',
    subtitle: '日常眼部放松用品',
    category: '生活护理',
    price: 29.9
  },

  {
    id: 8,
    name: 'U型护颈枕',
    subtitle: '出行休息护理用品',
    category: '生活护理',
    price: 49.9
  }

]

// 筛选商品
const filteredGoods = computed(() => {

  return goods.filter(item => {

    const categoryResult =
      currentCategory.value === '全部'
      || item.category === currentCategory.value

    const searchResult =
      item.name.includes(search.value)
      || item.subtitle.includes(search.value)

    return categoryResult && searchResult

  })

})

// 购物车总数量
const cartCount = computed(() => {

  let count = 0

  cartList.value.forEach(item => {
    count += item.count
  })

  return count

})

// 购物车总价
const totalPrice = computed(() => {

  let total = 0

  cartList.value.forEach(item => {
    total += item.price * item.count
  })

  return total

})

// 选择分类
const selectCategory = (name) => {

  if(currentCategory.value === name) {

    currentCategory.value = '全部'

  } else {

    currentCategory.value = name

  }

}

// 加入购物车
const addCart = (item) => {

  const cartItem = cartList.value.find(
    goodsItem => goodsItem.id === item.id
  )

  if(cartItem) {

    cartItem.count++

  } else {

    cartList.value.push({
      id: item.id,
      name: item.name,
      price: item.price,
      count: 1
    })

  }

  ElMessage.success(
    item.name + '已加入购物车'
  )

}

// 打开购物车
const showCart = () => {

  cartVisible.value = true

}

// 增加商品数量
const increase = (item) => {

  item.count++

}

// 减少商品数量
const decrease = (item) => {

  if(item.count > 1) {

    item.count--

  } else {

    ElMessage.info(
      '商品数量不能少于1'
    )

  }

}

// 删除商品
const deleteCart = (id) => {

  cartList.value = cartList.value.filter(
    item => item.id !== id
  )

  ElMessage.success(
    '商品已删除'
  )

}

// 模拟结算
const checkout = () => {

  if(cartList.value.length === 0) {

    ElMessage.info(
      '购物车还是空的'
    )

    return

  }

  ElMessage.success(
    '结算成功'
  )

  cartList.value = []

  cartVisible.value = false

}

// 重置商品
const resetGoods = () => {

  search.value = ''

  currentCategory.value = '全部'

}

// 底部导航
const navs = [

  {
    title: '云医院',
    img: '',
    path: '/home'
  },

  {
    title: '商城',
    img: '',
    path: '/shop'
  },

  {
    title: '发现',
    img: '',
    path: '/discover'
  },

  {
    title: '我',
    img: '',
    path: ''
  }

]

</script>

<style scoped>

/* 整个页面统一白色 */

.page {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 10vh;
  box-sizing: border-box;
}

/* 商城顶部 */

.shop-top {
  width: 100%;
  height: 7vh;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: solid 1px #eeeeee;
  box-sizing: border-box;
}

.shop-top p {
  margin: 0;
  font-size: 4.5vw;
  
}

.cart {
  position: absolute;
  right: 4vw;
  color: #127A90;
  font-size: 3.4vw;
  cursor: pointer;
}

.cart span {
  display: inline-block;
  min-width: 4vw;
  height: 4vw;
  line-height: 4vw;
  margin-left: 1vw;
  text-align: center;
  border-radius: 5vw;
  background-color: #e85d4a;
  color: #fff;
  font-size: 2.5vw;
}

/* 主体 */

.content {
  width: 100%;
  background-color: #fff;
}

/* 搜索 */

.search {
  width: 100%;
  padding: 3vw 4vw;
  background-color: #fff;
  border-bottom: solid 1px #eeeeee;
  box-sizing: border-box;
}

.search :deep(.el-input__wrapper) {
  background-color: #f5f5f5;
  border-radius: 5vw;
  box-shadow: none;
}

/* 商品分类 */

.category {
  width: 100%;
  background-color: #fff;
  border-bottom: solid 1px #eeeeee;
}

/* 分类标题 */

.itemTitle {
  width: 100%;
  height: 13vw;
  box-sizing: border-box;
  padding: 0 4vw;
  display: flex;
  align-items: center;
}

.itemTitle p {
  height: 5vw;
  line-height: 5vw;
  box-sizing: border-box;
  margin: 0;
  font-size: 4.3vw;
  letter-spacing: 0.2vw;
}

/* 分类选项 */

.category-item {
  height: 18vw;
  margin-bottom: 2vw;
  background-color: #f5f5f5;
  border-radius: 2vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
}

.category-item.selected {
  border: solid 0.3vw #127A90;
  background-color: #eef7f8;
}

.category-name {
  margin: 0;
  font-size: 4vw;
}

.category-subtitle {
  margin-top: 1.5vw;
  margin-bottom: 0;
  font-size: 2.7vw;
  color: #888;
}

/* 热门商品 */

.goods {
  width: 100%;
  background-color: #fff;
}

/* 商品标题 */

.goods-title {
  width: 100%;
  height: 13vw;
  padding: 0 4vw;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  align-items: center;
  border-bottom: solid 1px #eeeeee;
}

.goods-title p {
  height: 5vw;
  line-height: 5vw;
  margin: 0;
  box-sizing: border-box;
  font-size: 4.3vw;
  letter-spacing: 0.2vw;
}

/* 商品卡片 */

.goods-item {
  width: 100%;
  padding: 2vw;
  margin-bottom: 2vw;
  background-color: #fff;
  border-radius: 2vw;
  box-sizing: border-box;
}

/* 浅蓝色商品信息框 */

.goods-img {
  width: 100%;
  height: 29vw;
  padding: 2vw;
  border-radius: 1.5vw;
  background-color: #eef6f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
}

/* 商品名称 */

.goods-name {
  margin: 0;
  font-size: 3.7vw;
  color: #127A90;
}

/* 商品简介 */

.goods-subtitle {
  margin-top: 1.5vw;
  margin-bottom: 0;
  font-size: 2.8vw;
  color: #888;
}

/* 价格和加购按钮 */

.goods-bottom {
  width: 100%;
  margin-top: 2vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 商品价格 */

.price {
  color: #333;
  font-size: 3.5vw;
  font-weight: normal;
}

.goods-bottom :deep(.el-button) {
  background-color: #127A90;
  border-color: #127A90;
  color: #fff;
}

/* 没有商品 */

.empty {
  width: 100%;
  padding: 12vw 0;
  text-align: center;
  color: #888;
}

.empty p {
  font-size: 3.5vw;
}

.empty :deep(.el-button) {
  margin-top: 2vw;
  background-color: #127A90;
  border-color: #127A90;
  color: #fff;
}

/* 购物车 */

.cart-content {
  width: 100%;
}

.cart-item {
  width: 100%;
  padding: 4vw 0;
  border-bottom: solid 1px #eee;
}

.cart-item-info {
  width: 100%;
}

.cart-item-name {
  margin: 0;
  font-size: 4vw;
  color: #333;
}

.cart-item-price {
  margin-top: 2vw;
  margin-bottom: 0;
  color: #333;
  font-size: 3.5vw;
  font-weight: normal;
}

/* 数量 */

.cart-number {
  margin-top: 3vw;
  display: flex;
  align-items: center;
}

.cart-number span {
  width: 10vw;
  text-align: center;
  font-size: 4vw;
  color: #333;
}

.cart-delete {
  margin-top: 3vw;
}

/* 合计 */

.cart-total {
  margin-top: 5vw;
  padding-top: 4vw;
  border-top: solid 1px #eee;
}

.total-info p {
  margin: 2vw 0;
  font-size: 3.8vw;
  color: #333;
  font-weight: normal;
}

.checkout-button {
  width: 100%;
  margin-top: 4vw;
  background-color: #127A90;
  border-color: #127A90;
  color: #fff;
}

/* 空购物车 */

.cart-empty {
  width: 100%;
  padding-top: 20vw;
  text-align: center;
  color: #888;
}

.cart-empty p {
  margin-bottom: 5vw;
  font-size: 4vw;
}

</style>

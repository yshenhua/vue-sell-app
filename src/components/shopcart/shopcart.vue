<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div :class="['logo', {'highlight': totalCount > 0}]">
              <span class="icon-shopping_cart"></span>
            </div>
            <div v-show="totalCount > 0" class="num">{{totalCount}}</div>
          </div>
          <div :class="['price', {'highlight': totalPrice > 0}]">￥{{ totalPrice }}</div>
          <div class="desc">另需配送费用￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div :class="['pay', payClass]">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball, index) in balls" :key="index">
          <transition
            name="drop"
            @before-enter="beforeDrop"
            @enter="dropping"
            @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="totalCount && !fold">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods" :key="food.name">
                <span class="name">{{food.name}}</span>
                <span class="price">
                  <span>￥{{food.price*food.count}}</span>
                </span>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="totalCount && !fold"></div>
    </transition>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import cartcontrol from '@/components/cartcontrol/cartcontrol';

export default {
  props: {
    selectFoods: {
      type: Array,
      default () {
        return [];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold: true
    };
  },
  computed: {
    totalPrice () {
      let total = 0;
      this.selectFoods.forEach((food) => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount () {
      let count = 0;
      this.selectFoods.forEach((food) => {
        count += food.count;
      });
      return count;
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}起送`;
      } else if (this.totalPrice < this.minPrice) {
        return `还差￥${this.minPrice - this.totalPrice}起送`;
      } else {
        return '去结算';
      }
    },
    payClass () {
      return this.totalPrice < this.minPrice
        ? 'not-enough'
        : 'enough';
    }
  },
  watch: {
    totalCount (count) {
      if (count) return;
      this.fold = true;
    }
  },
  methods: {
    toggleList () {
      if (!this.totalCount) return;
      this.fold = !this.fold;
      if (!this.fold) {
        this.$nextTick(() => {
          if (!this.scroll) {
            // console.log('init');
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            });
          } else {
            // console.log('refresh');
            this.scroll.refresh();
          }
        });
      }
    },
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0;
      });
    },
    pay () {
      if (this.totalPrice < this.minPrice) return;
      window.alert(`支付${this.totalPrice}元`);
    },
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    beforeDrop (el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = '';
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    dropping (el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight; // 触发重绘
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)';
        el.style.transform = 'translate3d(0,0,0)';
        let inner = el.getElementsByClassName('inner-hook')[0];
        inner.style.webkitTransform = 'translate3d(0,0,0)';
        inner.style.transform = 'translate3d(0,0,0)';
        el.addEventListener('transitionend', done);
      });
    },
    afterDrop (el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = 'none';
      }
    }
  },
  components: {
    cartcontrol
  }
};
</script>

<style lang="stylus" scoped>
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    background #000
    .content
      display flex
      background-color #141d27
      font-size 0
      color: rgba(255, 255, 255, .4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          vertical-align top
          border-radius 50%
          background-color #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background-color #2b343c
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a
            &.highlight
              background-color rgb(0, 160, 220)
              .icon-shopping_cart
                color #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background-color rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, .4)
        .price
          display inline-block
          vertical-align top
          line-height 24px
          margin-top 12px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255, 255, 255, .1)
          font-size 16px
          font-weight 700
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          &.not-enough
            background-color #2b333b
          &.enough
            background-color #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 999
        transition all .4s cubic-bezier(.49, -0.29, .75, .41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background-color rgb(0, 160, 220)
          transition all .4s linear
    .shopcart-list
      position absolute
      top 0
      left 0
      z-index -1
      width 100%
      transform translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition all 0.5s
      &.fold-enter, &.fold-leave-to
        transform translate3d(0, 0, 0)
      .list-header
        line-height 40px
        height 40px
        padding 0 18px
        background-color #f3f5f7
        border-bottom 1px solid rgba(7, 17, 27, .1)
        .title
          float left
          font-size 14px
          color rgb(7, 17, 27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #fff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-bottom-1px(rgba(7, 17, 27, .1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7, 17, 27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    backdrop-filter blur(10px)
    opacity 1
    background rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity 0
      background rgba(7, 17, 27, 0)
</style>

<template>
    <div class="v-loading">
        <img src="./loading.gif" alt="">
        <p class="desc"></p>
    </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    title: {
      type: String,
      default: '正在加载中...'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/common/scss/const.scss';
@import '~@/common/scss/mymixin.scss';

    .v-loading {
        width: 100%;
        text-align: center;
        .desc{
            line-height: 20px;
            font-size: $font-size-small;
            color: $color-text-l;
        }
        img{
            width: 24px;
            height: 24px;
        }
    }
</style>

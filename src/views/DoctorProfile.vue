<template>
  <div class="profile-page">
    <AppHeader title="医生主页" />
    <div class="top-ban"></div>

    <!-- 医生信息头 -->
    <div class="doc-header">
      <img class="doc-avatar" :src="doc.avatar" :alt="doc.name" />
      <div class="doc-info">
        <p class="doc-name">{{ doc.name }} <span class="doc-title">{{ doc.title }}</span></p>
        <p class="doc-dept">{{ doc.dept }} · {{ doc.hospital }}</p>
        <div class="doc-tags">
          <span class="tag" v-for="t in doc.tags" :key="t">{{ t }}</span>
        </div>
      </div>
    </div>

    <!-- 数据栏 -->
    <div class="stats">
      <div class="stat-item">
        <p class="num">{{ doc.goodRate }}%</p>
        <p class="label">好评率</p>
      </div>
      <div class="stat-item">
        <p class="num">{{ doc.consultCount }}</p>
        <p class="label">接诊量</p>
      </div>
      <div class="stat-item">
        <p class="num">{{ doc.years }}年</p>
        <p class="label">从业年限</p>
      </div>
      <div class="stat-item">
        <p class="num">{{ doc.score }}</p>
        <p class="label">评分</p>
      </div>
    </div>

    <!-- 擅长 -->
    <div class="card">
      <div class="card-title">擅长领域</div>
      <p class="paragraph">{{ doc.skill }}</p>
    </div>

    <!-- 简介 -->
    <div class="card">
      <div class="card-title">医生简介</div>
      <p class="paragraph">{{ doc.intro }}</p>
    </div>

    <!-- 出诊时间 -->
    <div class="card">
      <div class="card-title">在线问诊时间</div>
      <div class="schedule">
        <div class="day" v-for="d in doc.schedule" :key="d.day">
          <p class="day-name">{{ d.day }}</p>
          <p class="day-time" :class="{ off: !d.online }">{{ d.online ? d.time : '休息' }}</p>
        </div>
      </div>
    </div>

    <!-- 患者评价 -->
    <div class="card">
      <div class="card-title">患者评价（{{ doc.reviews.length }}）</div>
      <div class="review" v-for="(r, i) in doc.reviews" :key="i">
        <div class="review-head">
          <span class="review-user">{{ r.user }}</span>
          <span class="review-stars">
            <i class="fa fa-star" v-for="n in 5" :key="n"
               :class="{ on: n <= r.stars }"></i>
          </span>
        </div>
        <p class="review-content">{{ r.content }}</p>
        <p class="review-time">{{ r.time }}</p>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-bar">
      <button class="consult-btn" @click="goConsult">
        <i class="fa fa-comments"></i> 立即咨询 ¥{{ doc.price }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const router = useRouter()

const dataMap = {
  1: {
    name: '刘长胜', title: '主任医师', dept: '心血管内科', hospital: '东软云医院',
    avatar: '/doctors/刘长胜.jpg',
    tags: ['高血压', '冠心病', '心律失常'],
    goodRate: 98, consultCount: 3260, years: 22, score: 4.9, price: 59,
    skill: '擅长高血压、冠心病、心律失常、心力衰竭的诊断与治疗，尤其对难治性高血压及冠心病介入治疗有丰富临床经验。',
    intro: '医学博士，主任医师，教授，博士生导师。从事心血管内科临床工作22年，曾任三甲医院心血管内科主任，发表SCI论文30余篇，主持国家自然科学基金2项。',
    schedule: [
      { day: '周一', online: true, time: '19:00-21:00' },
      { day: '周二', online: false, time: '' },
      { day: '周三', online: true, time: '19:00-21:00' },
      { day: '周四', online: false, time: '' },
      { day: '周五', online: true, time: '19:00-21:00' },
      { day: '周六', online: true, time: '10:00-12:00' },
      { day: '周日', online: false, time: '' }
    ],
    reviews: [
      { user: '156****4589', stars: 5, content: '刘主任非常耐心，解释得很清楚，用药建议很实用。', time: '2026-11-10' },
      { user: '138****2210', stars: 5, content: '回复很快，诊断专业，已经按照建议调整了用药。', time: '2026-10-28' },
      { user: '139****8876', stars: 4, content: '整体不错，就是回复时间稍微长了一点。', time: '2026-10-15' }
    ]
  },
  2: {
    name: '赵桂凤', title: '副主任医师', dept: '体检中心 / 健康管理', hospital: '东软健康体检中心',
    avatar: '/doctors/赵桂凤.jpg',
    tags: ['报告解读', '慢病管理', '健康评估'],
    goodRate: 99, consultCount: 1890, years: 15, score: 4.8, price: 49,
    skill: '擅长体检报告综合解读、慢病风险评估、亚健康状态调理及个性化健康管理方案制定。',
    intro: '副主任医师，国家健康管理师，从事健康管理与体检咨询工作15年，累计解读体检报告超10万份。',
    schedule: [
      { day: '周一', online: true, time: '09:00-12:00' },
      { day: '周二', online: true, time: '09:00-12:00' },
      { day: '周三', online: false, time: '' },
      { day: '周四', online: true, time: '14:00-17:00' },
      { day: '周五', online: true, time: '09:00-12:00' },
      { day: '周六', online: false, time: '' },
      { day: '周日', online: false, time: '' }
    ],
    reviews: [
      { user: '156****4589', stars: 5, content: '赵医生解读报告非常细致，每个异常指标都讲得很明白。', time: '2026-09-08' }
    ]
  },
  3: {
    name: '吕文达', title: '主治医师', dept: '消化内科', hospital: '东软云医院',
    avatar: '/doctors/吕文达.jpg',
    tags: ['胃炎', '脂肪肝', '肠道调理'],
    goodRate: 96, consultCount: 860, years: 8, score: 4.7, price: 39,
    skill: '擅长胃炎、胃溃疡、脂肪肝、肠易激综合征等消化系统常见疾病的诊疗与调理。',
    intro: '主治医师，医学硕士，从事消化内科临床工作8年，对消化系统常见病的规范化治疗有深入研究。',
    schedule: [
      { day: '周一', online: true, time: '20:00-22:00' },
      { day: '周二', online: true, time: '20:00-22:00' },
      { day: '周三', online: false, time: '' },
      { day: '周四', online: true, time: '20:00-22:00' },
      { day: '周五', online: false, time: '' },
      { day: '周六', online: true, time: '15:00-18:00' },
      { day: '周日', online: true, time: '15:00-18:00' }
    ],
    reviews: [
      { user: '137****5566', stars: 5, content: '吕医生很年轻但很专业，给出的饮食建议很实用。', time: '2026-11-10' }
    ]
  }
}

const doc = dataMap[route.params.id] || dataMap[1]
const goConsult = () => router.push(`/doctor/${route.params.id}/consult`)
</script>

<style scoped>
.profile-page { padding-bottom: 80px; }
.top-ban { height: 56px; }

.doc-header {
  display: flex; align-items: center; padding: 20px 4%;
  background-image: linear-gradient(135deg, #7DB35D, #02A6C9); color: #FFF;
}
.doc-avatar {
  width: 64px; height: 64px; border-radius: 50%; flex-shrink: 0;
  object-fit: cover; border: solid 2px rgba(255,255,255,.5);
}
.doc-info { margin-left: 14px; }
.doc-name { font-size: 20px; font-weight: 600; }
.doc-title { font-size: 13px; font-weight: normal; opacity: .9; margin-left: 6px; }
.doc-dept { font-size: 13px; margin-top: 4px; opacity: .9; }
.doc-tags { margin-top: 8px; }
.tag {
  display: inline-block; font-size: 11px; padding: 2px 8px;
  border-radius: 8px; background: rgba(255,255,255,.2); margin-right: 6px;
}

.stats {
  display: flex; background: #FFF; margin: 12px 4% 0; border-radius: 8px;
  padding: 16px 0; box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.stat-item { flex: 1; text-align: center; }
.stat-item .num { font-size: 18px; font-weight: 700; color: #333; }
.stat-item .label { font-size: 11px; color: #999; margin-top: 4px; }

.card {
  width: 92%; margin: 12px auto 0; background: #FFF;
  border-radius: 8px; padding: 16px; box-sizing: border-box;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.card-title {
  font-size: 15px; font-weight: 600; color: #333;
  padding-bottom: 10px; margin-bottom: 8px;
  border-bottom: solid 1px #EEE;
}
.paragraph { font-size: 13px; color: #555; line-height: 1.8; }

.schedule { display: flex; justify-content: space-between; }
.day { text-align: center; flex: 1; }
.day-name { font-size: 12px; color: #999; }
.day-time { font-size: 11px; color: #02A6C9; margin-top: 4px; }
.day-time.off { color: #CCC; }

.review { padding: 10px 0; border-bottom: solid 1px #F5F5F5; }
.review:last-child { border-bottom: none; }
.review-head { display: flex; justify-content: space-between; align-items: center; }
.review-user { font-size: 13px; color: #333; }
.review-stars .fa { font-size: 12px; color: #E5E5E5; margin-left: 2px; }
.review-stars .fa.on { color: #FFB800; }
.review-content { font-size: 13px; color: #555; margin-top: 6px; line-height: 1.6; }
.review-time { font-size: 11px; color: #BBB; margin-top: 4px; }

.bottom-bar {
  position: fixed; left: 0; bottom: 0; width: 100%; max-width: 750px;
  padding: 10px 4%; box-sizing: border-box; background: #FFF;
  border-top: solid 1px #EEE;
}
.consult-btn {
  width: 100%; height: 44px; border-radius: 22px; border: none;
  background-image: linear-gradient(135deg, #7DB35D, #02A6C9);
  color: #FFF; font-size: 16px;
}
.consult-btn .fa { margin-right: 6px; }
</style>

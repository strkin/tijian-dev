// 本项目不做后端，这里用浏览器本地数据模拟原来的发现页接口
// 数据只存在内存里，刷新页面后新发布的帖子会消失

const CLIENT_KEY = 'tijian_discover_client'
const AUTHOR_KEY = 'tijian_discover_author'

export const CATEGORIES = ['医疗科普', '养生保健', '运动健康', '心理健康', '饮食营养']
const COVERS = [1, 2, 3, 4, 5, 6, 7].map(function (n) { return '/covers/cover-' + n + '.svg' })
const LIMITS = { title: 80, content: 5000, images: 9 }

function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()
}

// 初始的示例帖子
let posts = [
  {
    id: 1,
    title: '高血压患者的日常饮食，记住这 5 点',
    content: '家里老人查出高血压之后，我把饮食整个调整了一遍，坚持了三个月，血压确实稳了不少。\n\n第一，盐一定要少。每天控制在 5 克以内，酱油、咸菜、火腿肠这些隐形盐也要算进去。\n\n第二，多吃含钾的食物，比如香蕉、菠菜、土豆，对调节血压有帮助。\n\n第三，油换成植物油，肥肉和动物内脏尽量少吃。\n\n第四，酒能不喝就不喝，烟最好戒掉。\n\n第五，三餐规律，不要暴饮暴食。\n\n最后提醒一句，饮食只是辅助，药不能自己停，有变化一定要问医生。',
    category: '养生保健',
    author: '王医生',
    cover: '/covers/cover-1.svg',
    images: [],
    likeCount: 328,
    createdAt: daysAgo(2 / 24)
  },
  {
    id: 2,
    title: '每天 8000 步真的有必要吗？',
    content: '经常看到有人说每天必须走够 8000 步，其实这个数字并不是硬性标准。\n\n对大多数成年人来说，每天 6000 到 8000 步已经能带来明显的健康收益，关键是坚持下去。\n\n如果平时久坐，可以从每天 3000 步开始，慢慢往上加。\n\n走路的时候注意姿势，抬头挺胸，步幅不要太大，鞋子要合脚。\n\n膝盖不好的人，不要硬撑，可以换成游泳、骑车这些对关节友好的运动。',
    category: '运动健康',
    author: '运动小达人',
    cover: '/covers/cover-2.svg',
    images: [],
    likeCount: 156,
    createdAt: daysAgo(5 / 24)
  },
  {
    id: 3,
    title: '熬夜之后怎么补回来？',
    content: '偶尔熬一次夜，第二天最重要的不是猛睡一整天，而是尽量把作息拉回正轨。\n\n中午可以补一个 20 到 30 分钟的小觉，时间不要太长，否则晚上更睡不着。\n\n多喝水，少吃高糖高油的东西，下午之后尽量不再喝咖啡。\n\n晚上提前一小时放下手机，把灯光调暗，让身体知道该休息了。\n\n如果长期熬夜、白天精神很差，建议去医院查一下，不要一直硬扛。',
    category: '心理健康',
    author: '睡眠研究所',
    cover: '/covers/cover-3.svg',
    images: [],
    likeCount: 89,
    createdAt: daysAgo(1)
  },
  {
    id: 4,
    title: '体检报告上的这些箭头，哪些需要重视',
    content: '拿到体检报告，看到一堆向上向下的小箭头，先别慌。\n\n有些指标轻微偏离正常值，可能和前一天没休息好、空腹时间不够、剧烈运动有关，复查一次往往就正常了。\n\n但血压、血糖、血脂、肝功能里明显超出范围的，或者连续几年都在变差的，就要认真对待。\n\n报告只是参考，最终还是拿给医生看，结合症状和病史判断。\n\n别自己上网查一查就下结论，更不要照着别人的药单买药。',
    category: '医疗科普',
    author: '检验科老张',
    cover: '/covers/cover-4.svg',
    images: [],
    likeCount: 512,
    createdAt: daysAgo(1.3)
  },
  {
    id: 5,
    title: '一周减脂便当搭配，简单又好吃',
    content: '上班带饭坚持了一个月，瘦了四斤，分享几个不容易翻车的搭配。\n\n主食：糙米饭、玉米、红薯轮着来，每次一个拳头大小。\n\n蛋白质：鸡胸肉、虾仁、鸡蛋、豆腐换着做，少油煎或者水煮。\n\n蔬菜：西兰花、胡萝卜、生菜、彩椒，尽量多放，颜色越丰富越好。\n\n调味用生抽、醋、黑胡椒、柠檬汁，少放沙拉酱。\n\n前一天晚上把菜切好分装，第二天早上十分钟就能搞定。',
    category: '饮食营养',
    author: '厨房日记',
    cover: '/covers/cover-5.svg',
    images: ['/covers/cover-6.svg'],
    likeCount: 233,
    createdAt: daysAgo(2)
  },
  {
    id: 6,
    title: '久坐腰痛，三个动作在家就能练',
    content: '坐办公室久了腰酸，其实不一定要去健身房。\n\n第一个动作是猫牛式，跪在垫子上，吸气塌腰抬头，呼气拱背低头，做 10 次。\n\n第二个是臀桥，仰卧屈膝，把屁股抬起来停两秒，做 15 次。\n\n第三个是死虫式，仰卧手脚抬起，对侧手脚交替伸展，做 10 次一组。\n\n动作要慢，不要憋气。如果做的时候疼得厉害，先停下来，去医院看看。',
    category: '运动健康',
    author: '康复师小林',
    cover: '/covers/cover-6.svg',
    images: [],
    likeCount: 178,
    createdAt: daysAgo(3)
  },
  {
    id: 7,
    title: '焦虑的时候，试试 4-7-8 呼吸法',
    content: '最近工作压力大，晚上躺下脑子停不下来，试了几天 4-7-8 呼吸法，确实有点用。\n\n做法很简单：用鼻子吸气 4 秒，屏住呼吸 7 秒，再用嘴慢慢呼气 8 秒，重复四轮。\n\n重点是呼气要慢，肩膀放松，不要刻意吸得太满。\n\n刚开始可能会有点头晕，坐着做就好，不要站着。\n\n如果焦虑已经影响到吃饭和睡觉，还是建议找专业医生聊聊。',
    category: '心理健康',
    author: '心理咨询师阿May',
    cover: '/covers/cover-7.svg',
    images: [],
    likeCount: 64,
    createdAt: daysAgo(4)
  },
  {
    id: 8,
    title: '秋冬换季，孩子反复感冒怎么办',
    content: '一到换季，幼儿园里此起彼伏地咳嗽，家长最头疼。\n\n首先，感冒大多数是病毒引起的，不需要一上来就吃抗生素。\n\n其次，家里注意通风，湿度保持在 40% 到 60%，太干太湿都不好。\n\n孩子发烧的时候多喝水，衣服不要捂得太厚，观察精神状态比盯着体温计更重要。\n\n如果持续高烧超过三天、精神差、呼吸急促，要及时就医。',
    category: '医疗科普',
    author: '儿科李医生',
    cover: '/covers/cover-1.svg',
    images: [],
    likeCount: 401,
    createdAt: daysAgo(5)
  },
  {
    id: 9,
    title: '关于补钙，你可能一直都补错了',
    content: '很多人一过四十就开始补钙，但补钙这件事不是越多越好。\n\n成年人每天需要的钙大约 800 毫克，一杯牛奶大约 300 毫克，正常饮食加上一杯奶基本够了。\n\n补钙的同时要注意维生素 D，不然吸收不了，平时可以适当晒太阳。\n\n钙片不要一次吃太多，分次吃吸收更好，也不要和铁剂一起吃。\n\n有肾结石病史的人，补钙前先问医生。',
    category: '饮食营养',
    author: '营养师小周',
    cover: '/covers/cover-2.svg',
    images: [],
    likeCount: 267,
    createdAt: daysAgo(6)
  },
  {
    id: 10,
    title: '体检前这些事千万别做，会影响结果',
    content: '体检前一天晚上八点以后尽量别再吃东西，第二天早上保持空腹。\n\n体检前不要剧烈运动，也不要喝酒，否则肝功能、肌酸激酶这些指标可能会异常。\n\n女性做妇科检查要避开生理期。\n\n正在吃药的人不要擅自停药，把药名告诉医生，让医生判断。\n\n体检当天穿宽松的衣服，不要戴项链，方便检查。',
    category: '医疗科普',
    author: '体检中心',
    cover: '/covers/cover-3.svg',
    images: [],
    likeCount: 720,
    createdAt: daysAgo(8)
  },
  {
    id: 11,
    title: '每天一杯养生茶，真的养生吗',
    content: '枸杞、红枣、菊花、决明子，很多人办公室里常备。\n\n适量喝没问题，但要看你是什么体质。\n\n比如决明子偏凉，脾胃虚寒的人喝多了容易拉肚子；红枣糖分高，血糖高的人要少放。\n\n另外，养生茶不能代替喝水，也不能代替吃药。\n\n如果正在服用中药或者西药，最好问一下医生会不会互相影响。',
    category: '养生保健',
    author: '茶话健康',
    cover: '/covers/cover-4.svg',
    images: [],
    likeCount: 132,
    createdAt: daysAgo(10)
  },
  {
    id: 12,
    title: '跑步膝盖疼，是姿势不对还是量太大',
    content: '跑步之后膝盖疼，先别急着怪跑鞋。\n\n最常见的原因是跑量增加太快，身体还没适应就加距离、加速度。\n\n建议每周跑量增加不超过 10%，跑前热身、跑后拉伸都要做。\n\n姿势上注意步频不要太低，落脚点尽量在身体正下方，不要跨大步。\n\n如果疼了两周还没好，或者上下楼梯都疼，建议去骨科或者运动医学科看看。',
    category: '运动健康',
    author: '跑者阿凯',
    cover: '/covers/cover-5.svg',
    images: [],
    likeCount: 198,
    createdAt: daysAgo(12)
  }
]

let nextId = 13
let likedIds = new Set()

function wait(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms) })
}

function findPost(id) {
  let num = Number(id)
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === num) {
      return posts[i]
    }
  }
  return null
}

// 列表里用的摘要
function toListItem(post) {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.content.replace(/\n/g, ' ').slice(0, 60),
    category: post.category,
    author: post.author,
    cover: post.cover,
    likeCount: post.likeCount,
    createdAt: post.createdAt,
    liked: likedIds.has(post.id)
  }
}

function toDetail(post) {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    author: post.author,
    cover: post.cover,
    images: post.images,
    likeCount: post.likeCount,
    createdAt: post.createdAt,
    liked: likedIds.has(post.id)
  }
}

export function getClientId() {
  let id = ''
  try {
    id = localStorage.getItem(CLIENT_KEY) || ''
  } catch (e) {
    id = ''
  }
  if (/^[A-Za-z0-9_-]{6,64}$/.test(id)) {
    return id
  }
  id = 'local_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  try {
    localStorage.setItem(CLIENT_KEY, id)
  } catch (e) {
    /* 隐私模式下写不了 localStorage，也不影响使用 */
  }
  return id
}

export function getSavedAuthor() {
  try {
    return localStorage.getItem(AUTHOR_KEY) || ''
  } catch (e) {
    return ''
  }
}

export function saveAuthor(name) {
  try {
    localStorage.setItem(AUTHOR_KEY, name)
  } catch (e) {
    /* 忽略 */
  }
}

// 列表：分类、关键词、分页都在本地做
export async function fetchPosts(options) {
  let opts = options || {}
  let category = opts.category || ''
  let keyword = (opts.keyword || '').trim()
  let page = opts.page || 1
  let pageSize = opts.pageSize || 10
  await wait(120)

  let list = []
  for (let i = 0; i < posts.length; i++) {
    let post = posts[i]
    let ok = true
    if (category && category !== '全部' && post.category !== category) {
      ok = false
    }
    if (keyword && post.title.indexOf(keyword) < 0 && post.content.indexOf(keyword) < 0) {
      ok = false
    }
    if (ok) {
      list.push(post)
    }
  }

  let total = list.length
  let start = (page - 1) * pageSize
  let pageList = list.slice(start, start + pageSize)
  return {
    list: pageList.map(toListItem),
    total: total,
    page: page,
    pageSize: pageSize,
    hasMore: start + pageList.length < total
  }
}

export async function fetchPost(id) {
  await wait(120)
  let post = findPost(id)
  if (!post) {
    let err = new Error('帖子不存在或已被删除')
    err.status = 404
    throw err
  }
  return { post: toDetail(post) }
}

export async function createPost(payload) {
  await wait(150)
  let body = payload || {}
  let title = String(body.title || '').trim()
  let content = String(body.content || '').trim()

  if (!title) {
    throw new Error('请填写标题')
  }
  if (title.length > LIMITS.title) {
    throw new Error('标题不能超过 ' + LIMITS.title + ' 个字')
  }
  if (!content) {
    throw new Error('请填写正文')
  }
  if (content.length > LIMITS.content) {
    throw new Error('正文不能超过 ' + LIMITS.content + ' 个字')
  }

  let cover = body.cover
  if (!cover) {
    cover = COVERS[Math.floor(Math.random() * COVERS.length)]
  }
  let images = []
  if (Array.isArray(body.images)) {
    images = body.images.slice(0, LIMITS.images)
  }

  let post = {
    id: nextId,
    title: title,
    content: content,
    category: CATEGORIES.indexOf(body.category) >= 0 ? body.category : CATEGORIES[0],
    author: String(body.author || '').trim().slice(0, 30) || '匿名用户',
    cover: cover,
    images: images,
    likeCount: 0,
    createdAt: new Date().toISOString()
  }
  nextId++
  posts.unshift(post)
  return { post: toDetail(post) }
}

export async function toggleLike(id) {
  await wait(80)
  let post = findPost(id)
  if (!post) {
    throw new Error('帖子不存在或已被删除')
  }
  if (likedIds.has(post.id)) {
    likedIds.delete(post.id)
    post.likeCount = Math.max(post.likeCount - 1, 0)
    return { liked: false, likeCount: post.likeCount }
  }
  likedIds.add(post.id)
  post.likeCount = post.likeCount + 1
  return { liked: true, likeCount: post.likeCount }
}

// 没有后端，上传的图片转成 base64 直接显示
export function uploadImage(file) {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader()
    reader.onload = function () {
      resolve({ url: String(reader.result) })
    }
    reader.onerror = function () {
      reject(new Error('图片读取失败'))
    }
    reader.readAsDataURL(file)
  })
}

export async function fetchMeta() {
  return {
    categories: CATEGORIES,
    covers: COVERS,
    limits: LIMITS
  }
}

import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

// ============================================================
//  STEP 2: Replace with your Google Cloud Vision API key
//  Go to: console.cloud.google.com → APIs → Vision API → Credentials
// ============================================================
const VISION_API_KEY = 'AIzaSyC5WXh2kpmHKami3OYMBK11p2ji-DzXPkY'

// Korean allergen keywords mapped to English names
const ALLERGEN_KEYWORDS = {
  'Eggs':      ['계란','달걀','난황','난백','egg'],
  'Milk':      ['우유','유청','유단백','milk','dairy','lactose'],
  'Buckwheat': ['메밀','buckwheat'],
  'Peanuts':   ['땅콩','peanut'],
  'Soybeans':  ['대두','콩','soy','soybean','tofu'],
  'Wheat':     ['밀','소맥','wheat','flour','gluten'],
  'Pine nuts': ['잣','pine nut'],
  'Walnuts':   ['호두','walnut'],
  'Crab':      ['게','크랩','crab'],
  'Shrimp':    ['새우','shrimp','prawn'],
  'Squid':     ['오징어','squid'],
  'Mackerel':  ['고등어','mackerel'],
  'Shellfish': ['조개','패류','shellfish','clam','mussel'],
  'Peach':     ['복숭아','peach'],
  'Tomato':    ['토마토','tomato'],
  'Chicken':   ['닭','chicken','poultry'],
  'Pork':      ['돼지','돈육','pork'],
  'Beef':      ['소고기','쇠고기','beef','bovine'],
  'Sulfites':  ['아황산','sulfite','sulphite','SO2'],
}

// Official Korean Food Type List (식품유형 공식 목록) — from MFDS classification
const FOOD_TYPES = [
  '과자','캔디류','추잉껌','빵류','떡류',
  '아이스크림','저지방아이스크림','아이스밀크','샤베트','비유지방아이스크림',
  '아이스크림믹스','저지방아이스크림믹스','비유지방아이스크림믹스','빙과',
  '식용얼음','어업용얼음',
  '코코아매스','코코아버터','코코아분말','기타코코아가공품',
  '초콜릿','밀크초콜릿','화이트초콜릿','준초콜릿','초콜릿가공품',
  '설탕','기타설탕','당시럽류','올리고당','과당','기타과당','물엿','기타엿','덱스트린','당류가공품류',
  '잼','기타잼',
  '두부','유바','가공두부','묵류',
  '콩기름','대두유','옥수수기름','옥배유','채종유','유채유','카놀라유','미강유','현미유',
  '참기름','추출들깨유','홍화유','사플라워유','잇꽃유','해바라기유','목화씨기름','면실유',
  '땅콩기름','낙화생유','올리브유','팜유','팜올레인유','팜스레아린유','팜핵유','야자유',
  '고추씨기름','기타식물성유지','식용우지','식용돈지','원료우지','원료돈지',
  '향미유','가공유지','쇼트닝','마가린류','모조치즈','식물성크림','기타식용유지가공품',
  '생면','숙면','건면','유탕면',
  '침출차','액상차','고형차','커피',
  '농축과채즙','과채주스','과채음료','탄산수','탄산음료',
  '원액두유','가공두유','두유',
  '유산균음료','효모음료','기타발효음료','홍삼인삼음료','혼합음료','음료베이스','기타음료',
  '영아용조제유','성장기용조제유','영아용조제식','성장기용조제식',
  '영유아용곡류조제식','기타영유아식','환자용식품','선천성대사질환자용식품',
  '영유아용특수조제식품','체중조절용조제식품','임산수유부용식품',
  '한식메주','개량메주','한식간장','양조간장','산분해간장','효소분해간장','혼합간장',
  '한식된장','된장','고추장','춘장','청국장','혼합장','기타장류',
  '발효식초','희석초산','소스','마요네즈','토마토케첩','복합조미식품',
  '카레분','커리분','카레','커리',
  '고춧가루','실고추','천연향신료','향신료조제품',
  '천일염','재제소금','태움용융소금','정제소금','기타소금','가공소금','식염',
  '김치','절임식품','당절임','조림류',
  '탁주','약주','청주','맥주','과실주','소주','위스키','브랜디','일반증류주','리큐르','기타주류','주정',
  '전분','전분가공품','밀가루','영양강화밀가루',
  '땅콩버터','땅콩또는견과류가공품류','시리얼류','찐쌀','효소식품',
  '과채가공품','곡류가공품','두류가공품','서류가공품','기타농산가공품',
  '햄','생햄','프레스햄','소시지','발효소시지','혼합소시지',
  '베이컨','양념육','분쇄가공육제품','갈비가공품','천연케이싱',
  '식육추출가공품','식육함유가공품','포장육',
  '전란액','난황액','난백액','전란분','난황분','난백분','알가열제품','알함유가공품',
  '우유','환원유','강화우유','유당분해우유','가공유','산양유',
  '발효유','농후발효유','크림발효유','농후크림발효유','발효버터유','발효유분말','버터유',
  '농축우유','탈지농축우유','가당연유','가당탈지연유','가공연유',
  '유크림','가공유크림','버터','버터오일',
  '자연치즈','가공치즈',
  '전지분유','탈지분유','가당분유','혼합분유',
  '유청','농축유청','유청단백분말','유당','유단백가수분해식품',
  '어육살','연육','어육반제품','어묵','어육소시지','기타어육가공품',
  '양념젓갈','액젓','조미액젓','젓갈',
  '조미건어포','건어포','기타건포류',
  '조미김','한천','기타수산물가공품',
  '기타식육','기타알','기타동물성가공식품',
  '곤충가공식품','자라분말','자라분말제품','자라유제품','추출가공식품',
  '벌집꿀','사양벌꿀','로얄젤리','로얄젤리제품','가공화분','화분함유제품',
  '생식제품','생식함유제품','즉석섭취식품','신선편의식품','즉석조리식품',
  '만두','만두피','효모식품','기타가공품',
]


export default function CameraPage({ setResult }) {
  const nav = useNavigate()
  const videoRef   = useRef(null)
  const canvasRef  = useRef(null)
  const streamRef  = useRef(null)
  const inputRef   = useRef(null)

  const [mode, setMode]       = useState('camera') // 'camera' | 'preview'
  const [imgSrc, setImgSrc]   = useState(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError]     = useState('')
  const [camReady, setCamReady] = useState(false)

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  async function startCamera() {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => setCamReady(true)
      }
    } catch (e) {
      setError('Camera access denied. Please allow camera permission and try again, or use the upload option below.')
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
  }

  function capturePhoto() {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setImgSrc(dataUrl)
    setMode('preview')
    stopCamera()
  }

  function retake() {
    setImgSrc(null)
    setMode('camera')
    startCamera()
  }

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setImgSrc(ev.target.result)
      setMode('preview')
      stopCamera()
    }
    reader.readAsDataURL(file)
  }

  async function analyzeImage() {
    if (!imgSrc) return
    setScanning(true)
    setError('')

    try {
      // 1. Load user allergens from Firestore
      const user = auth.currentUser
      const snap = await getDoc(doc(db, 'users', user.uid))
      const userAllergens = snap.data()?.allergies || []

      // 2. Call Google Vision API
      const base64 = imgSrc.split(',')[1]
      const visionRes = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              image: { content: base64 },
              features: [{ type: 'TEXT_DETECTION', maxResults: 1 }]
            }]
          })
        }
      )
      const visionData = await visionRes.json()

      if (visionData.error) throw new Error('Vision API error: ' + visionData.error.message)

      const fullText = visionData.responses?.[0]?.fullTextAnnotation?.text || ''
      const textLower = fullText.toLowerCase()

      if (!fullText) {
        setError('No text detected. Please make sure the food label is well-lit and in focus.')
        setScanning(false)
        return
      }

      // 3. Check detected text against user's allergens
      const found = []
      for (const allergen of userAllergens) {
        const keywords = ALLERGEN_KEYWORDS[allergen] || [allergen.toLowerCase()]
        const hit = keywords.some(kw => textLower.includes(kw.toLowerCase()))
        if (hit) found.push(allergen)
      }

      // 4. Extract food type using official Korean food type list
      let foodType = null
      const typeMatch = fullText.match(/식품유형[:\\s]*([^\\n\\r]+)/)
      if (typeMatch) {
        const rawType = typeMatch[1].trim()
        const matched = FOOD_TYPES
          .filter(ft => rawType.includes(ft))
          .sort((a, b) => b.length - a.length)
        foodType = matched.length > 0 ? matched[0] : rawType.split(/\\s+/)[0]
      }
      if (!foodType) {
        const matched = FOOD_TYPES
          .filter(ft => fullText.includes(ft))
          .sort((a, b) => b.length - a.length)
        if (matched.length > 0) foodType = matched[0]
      }

      // 5. Fetch HACCP alternatives if allergens found and food type known
      let alternatives = []
      if (found.length > 0 && foodType) {
        alternatives = await fetchHACCPAlternatives(foodType, userAllergens)
      }

      setResult({ safe: found.length === 0, found, userAllergens, fullText, foodType, alternatives })
      nav('/result')

    } catch (e) {
      console.error(e)
      setError('Analysis failed: ' + e.message)
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="page">
      <div className="page-inner fade-up">

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <button className="back-btn" style={{ marginBottom:0 }} onClick={() => { stopCamera(); nav('/home') }}>
            ← Back
          </button>
          <p className="section-title" style={{ marginBottom:0 }}>Scan Label</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom:16 }}>{error}</div>}

        {/* Camera / Preview */}
        {mode === 'camera' ? (
          <>
            <div className="camera-container" style={{ marginBottom:16 }}>
              <video ref={videoRef} autoPlay playsInline muted style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              {camReady && (
                <div className="camera-overlay">
                  <div className="scan-frame">
                    <div className="scan-line" />
                  </div>
                </div>
              )}
              {!camReady && !error && (
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
                  <div className="big-spinner" />
                  <p style={{ color:'var(--text-muted)', fontSize:13 }}>Starting camera…</p>
                </div>
              )}
            </div>
            <p style={{ textAlign:'center', fontSize:12, color:'var(--text-muted)', marginBottom:20 }}>
              Align the nutrition label inside the frame
            </p>
            <button className="btn btn-primary" onClick={capturePhoto} disabled={!camReady} style={{ marginBottom:12 }}>
              📸 Capture
            </button>
          </>
        ) : (
          <>
            <div style={{ marginBottom:16, borderRadius:'var(--radius)', overflow:'hidden', border:'1px solid var(--border)' }}>
              <img src={imgSrc} alt="Captured label" style={{ width:'100%', display:'block' }} />
            </div>
            <div style={{ display:'flex', gap:10, marginBottom:16 }}>
              <button className="btn btn-ghost" style={{ flex:1 }} onClick={retake}>↩ Retake</button>
              <button className="btn btn-primary" style={{ flex:2 }} onClick={analyzeImage} disabled={scanning}>
                {scanning ? <><span className="spinner" /> Analyzing…</> : '🔍 Analyze for Allergens'}
              </button>
            </div>
          </>
        )}

        {/* Upload fallback */}
        <div className="divider">or upload a photo</div>
        <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFileUpload} />
        <button className="btn btn-ghost" onClick={() => inputRef.current.click()}>
          📁 Upload from Gallery
        </button>

      </div>
      <canvas ref={canvasRef} style={{ display:'none' }} />

      {scanning && (
        <div className="loader-overlay">
          <div className="big-spinner" />
          <p className="loader-text">Reading food label…</p>
          <p style={{ fontSize:12, color:'var(--text-dim)' }}>Checking for your allergens</p>
        </div>
      )}
    </div>
  )
}

// ============================================================
//  HACCP API — safe alternative products
//  Replace HACCP_SERVICE_KEY with your key from data.go.kr
// ============================================================
const HACCP_SERVICE_KEY = '9dc803d2275be7fa4ba433243dac6454ca82d769a0d9ba947bc8685cc85b1005'

async function fetchHACCPAlternatives(foodType, userAllergens) {
  try {
    // Encode allergens as Korean keywords for exclusion search
    const allergenKR = {
      'Eggs':'계란','Milk':'우유','Buckwheat':'메밀','Peanuts':'땅콩',
      'Soybeans':'대두','Wheat':'밀','Pine nuts':'잣','Walnuts':'호두',
      'Crab':'게','Shrimp':'새우','Squid':'오징어','Mackerel':'고등어',
      'Shellfish':'조개','Peach':'복숭아','Tomato':'토마토','Chicken':'닭',
      'Pork':'돼지','Beef':'소고기','Sulfites':'아황산'
    }

    // HACCP 공공데이터 API endpoint
    // 식품안전나라 HACCP 인증제품 API
    const url = new URL('https://apis.data.go.kr/B553748/CertImgListServiceV3/getCertImgListServiceV3')
    url.searchParams.set('serviceKey', HACCP_SERVICE_KEY)
    url.searchParams.set('returnType', 'json')
    url.searchParams.set('numOfRows', '5')
    url.searchParams.set('pageNo', '1')
    url.searchParams.set('prdkind', foodType.slice(0, 10)) // food type search

    const res = await fetch(url.toString())
    const json = await res.json()

    // API returns body.items as array of {item: {...}} objects
    const rawItems = json?.body?.items || []
    const items = rawItems.map(i => i.item || i)

    // Filter out products that contain any of user's allergens
    return items
      .filter(item => {
        const allergy = (item.allergy || '').toLowerCase()
        return !userAllergens.some(a => {
          const kr = allergenKR[a] || ''
          return allergy.includes(kr.toLowerCase()) || allergy.includes(a.toLowerCase())
        })
      })
      .slice(0, 3)
      .map(item => ({
        name:     item.prdlstNm || 'Unknown product',
        type:     item.prdkind || foodType,
        company:  item.manufacture || '',
        allergy:  item.allergy || 'No allergen info',
        image:    item.imgurl1 || item.imgurl2 || null,
      }))
  } catch (e) {
    console.warn('HACCP fetch failed:', e)
    return []
  }
}

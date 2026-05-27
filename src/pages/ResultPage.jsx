import { useNavigate } from 'react-router-dom'

const FOOD_TYPE_EN = {
  '과자':'Snack','캔디류':'Candy','추잉껌':'Chewing Gum','빵류':'Bread','떡류':'Rice Cake',
  '아이스크림':'Ice Cream','저지방아이스크림':'Low-fat Ice Cream','아이스밀크':'Ice Milk',
  '샤베트':'Sherbet','비유지방아이스크림':'Non-dairy Ice Cream',
  '아이스크림믹스':'Ice Cream Mix','빙과':'Iced Dessert','식용얼음':'Edible Ice',
  '코코아매스':'Cocoa Mass','코코아버터':'Cocoa Butter','코코아분말':'Cocoa Powder',
  '기타코코아가공품':'Other Cocoa Products',
  '초콜릿':'Chocolate','밀크초콜릿':'Milk Chocolate','화이트초콜릿':'White Chocolate',
  '준초콜릿':'Semi-chocolate','초콜릿가공품':'Chocolate Confectionery',
  '설탕':'Sugar','당시럽류':'Sugar Syrup','올리고당':'Oligosaccharide',
  '과당':'Fructose','물엿':'Starch Syrup','덱스트린':'Dextrin','당류가공품류':'Sugar Products',
  '잼':'Jam','기타잼':'Other Jam',
  '두부':'Tofu','유바':'Yuba','가공두부':'Processed Tofu','묵류':'Jelly (Muk)',
  '콩기름':'Soybean Oil','대두유':'Soybean Oil','옥수수기름':'Corn Oil',
  '채종유':'Canola Oil','카놀라유':'Canola Oil','미강유':'Rice Bran Oil',
  '참기름':'Sesame Oil','추출들깨유':'Perilla Oil','홍화유':'Safflower Oil',
  '해바라기유':'Sunflower Oil','목화씨기름':'Cottonseed Oil','면실유':'Cottonseed Oil',
  '땅콩기름':'Peanut Oil','올리브유':'Olive Oil','팜유':'Palm Oil','야자유':'Coconut Oil',
  '향미유':'Flavored Oil','가공유지':'Processed Fat','쇼트닝':'Shortening',
  '마가린류':'Margarine','모조치즈':'Imitation Cheese','식물성크림':'Vegetable Cream',
  '생면':'Fresh Noodles','숙면':'Cooked Noodles','건면':'Dried Noodles','유탕면':'Fried Noodles',
  '침출차':'Leaf Tea','액상차':'Liquid Tea','고형차':'Solid Tea','커피':'Coffee',
  '과채주스':'Fruit & Vegetable Juice','과채음료':'Fruit & Vegetable Drink',
  '탄산수':'Sparkling Water','탄산음료':'Carbonated Beverage',
  '원액두유':'Pure Soy Milk','가공두유':'Processed Soy Milk','두유':'Soy Milk',
  '유산균음료':'Probiotic Drink','효모음료':'Yeast Drink','혼합음료':'Mixed Drink',
  '음료베이스':'Beverage Base','기타음료':'Other Beverage',
  '한식간장':'Korean Soy Sauce','양조간장':'Brewed Soy Sauce',
  '된장':'Doenjang (Soybean Paste)','한식된장':'Korean Soybean Paste',
  '고추장':'Gochujang (Red Pepper Paste)','춘장':'Black Bean Paste','청국장':'Cheonggukjang',
  '발효식초':'Fermented Vinegar','소스':'Sauce','마요네즈':'Mayonnaise',
  '토마토케첩':'Tomato Ketchup','복합조미식품':'Seasoning Mix','카레':'Curry','커리':'Curry',
  '고춧가루':'Red Pepper Powder','실고추':'Dried Red Pepper Strips',
  '천연향신료':'Natural Spice','향신료조제품':'Spice Blend',
  '천일염':'Sea Salt','정제소금':'Refined Salt','식염':'Salt','가공소금':'Processed Salt',
  '김치':'Kimchi','절임식품':'Pickled Food','당절임':'Sugar Preserved Food','조림류':'Braised Food',
  '탁주':'Makgeolli','약주':'Yakju','맥주':'Beer','소주':'Soju',
  '위스키':'Whiskey','브랜디':'Brandy','과실주':'Fruit Wine',
  '전분':'Starch','밀가루':'Wheat Flour','시리얼류':'Cereal','찐쌀':'Parboiled Rice',
  '과채가공품':'Processed Fruit & Vegetable','곡류가공품':'Processed Grain',
  '두류가공품':'Processed Legume','서류가공품':'Processed Tuber',
  '햄':'Ham','생햄':'Prosciutto','소시지':'Sausage','발효소시지':'Fermented Sausage',
  '베이컨':'Bacon','양념육':'Seasoned Meat','갈비가공품':'Processed Galbi',
  '식육추출가공품':'Meat Extract Product','식육함유가공품':'Meat-containing Product','포장육':'Packaged Meat',
  '우유':'Milk','강화우유':'Fortified Milk','가공유':'Processed Milk','산양유':'Goat Milk',
  '발효유':'Fermented Milk','농후발효유':'Thick Fermented Milk','버터유':'Buttermilk',
  '농축우유':'Condensed Milk','가당연유':'Sweetened Condensed Milk',
  '유크림':'Cream','버터':'Butter',
  '자연치즈':'Natural Cheese','가공치즈':'Processed Cheese',
  '전지분유':'Whole Milk Powder','탈지분유':'Skim Milk Powder',
  '유청':'Whey','유당':'Lactose',
  '어육살':'Fish Meat','연육':'Surimi','어묵':'Fish Cake','어육소시지':'Fish Sausage',
  '젓갈':'Jeotgal (Salted Seafood)','액젓':'Fish Sauce','조미액젓':'Seasoned Fish Sauce',
  '건어포':'Dried Fish','조미건어포':'Seasoned Dried Fish',
  '조미김':'Seasoned Seaweed (Gim)','한천':'Agar',
  '로얄젤리':'Royal Jelly','가공화분':'Processed Pollen',
  '즉석섭취식품':'Ready-to-eat Food','신선편의식품':'Fresh Convenience Food',
  '즉석조리식품':'Ready-to-cook Food','만두':'Mandu (Dumpling)','만두피':'Dumpling Wrapper',
  '효모식품':'Yeast Food','기타가공품':'Other Processed Food',
}

export default function ResultPage({ result }) {
  const nav = useNavigate()

  if (!result) {
    return (
      <div className="page" style={{ justifyContent:'center', alignItems:'center' }}>
        <div className="page-inner" style={{ textAlign:'center' }}>
          <p style={{ color:'var(--text-muted)', marginBottom:20 }}>No scan result found.</p>
          <button className="btn btn-primary" onClick={() => nav('/camera')}>Go to Camera</button>
        </div>
      </div>
    )
  }

  const { safe, found, userAllergens, foodType, alternatives } = result
  const foodTypeEn = foodType ? (FOOD_TYPE_EN[foodType] || '') : ''

  return (
    <div className="page">
      <div className="page-inner fade-up">

        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <button className="back-btn" style={{ marginBottom:0 }} onClick={() => nav('/home')}>← Home</button>
          <p className="section-title" style={{ marginBottom:0 }}>Scan Result</p>
        </div>

        {safe ? (
          <div className="result-safe" style={{ marginBottom:20 }}>
            <span className="result-icon">✅</span>
            <p className="result-title">Safe to Eat!</p>
            <p style={{ color:'rgba(61,255,122,0.7)', fontSize:14, lineHeight:1.6 }}>
              None of your allergens were detected in this product.
            </p>
            {userAllergens.length > 0 && (
              <p style={{ marginTop:12, fontSize:12, color:'rgba(61,255,122,0.5)' }}>
                Checked: {userAllergens.join(', ')}
              </p>
            )}
          </div>
        ) : (
          <div className="result-danger" style={{ marginBottom:20 }}>
            <span className="result-icon">⚠️</span>
            <p className="result-title">Allergen Detected!</p>
            <p style={{ color:'rgba(255,100,100,0.8)', fontSize:14, lineHeight:1.6, marginBottom:16 }}>
              This product contains ingredient(s) you are allergic to. Do <strong>not</strong> consume this product.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:6 }}>
              {found.map(a => (
                <span key={a} className="tag tag-red" style={{ fontSize:13, padding:'6px 14px' }}>
                  ⚠ {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {foodType && (
          <div style={{ marginBottom:20 }}>
            <p style={{ fontSize:12, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>
              Detected Food Type
            </p>
            <span className="tag tag-warn">
              {foodType}{foodTypeEn ? ` · ${foodTypeEn}` : ''}
            </span>
          </div>
        )}

        {!safe && (
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>
              Safe Alternatives (HACCP Certified)
            </p>
            <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:12 }}>
              Similar products without your allergens:
            </p>

            {alternatives && alternatives.length > 0 ? (
              alternatives.map((alt, i) => (
                <div key={i} className="alt-product" style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  {alt.image && (
                    <img
                      src={alt.image}
                      alt={alt.name}
                      style={{ width:72, height:72, objectFit:'cover', borderRadius:8, flexShrink:0, border:'1px solid var(--border)' }}
                      onError={e => { e.target.style.display='none' }}
                    />
                  )}
                  <div style={{ flex:1 }}>
                    <p className="alt-product-name">{alt.name}</p>
                    <p className="alt-product-meta">
                      {alt.company && <span>{alt.company} · </span>}
                      {alt.type}{FOOD_TYPE_EN[alt.type] ? ` · ${FOOD_TYPE_EN[alt.type]}` : ''}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="card" style={{ textAlign:'center', padding:'20px' }}>
                <p style={{ fontSize:13, color:'var(--text-muted)' }}>
                  No alternative products found for this food type.<br />
                  <span style={{ fontSize:12, color:'var(--text-dim)', marginTop:6, display:'block' }}>
                    Try searching food safety databases manually.
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button className="btn btn-primary" onClick={() => nav('/camera')}>
            📸 Scan Another Product
          </button>
          <button className="btn btn-ghost" onClick={() => nav('/home')}>
            ← Back to Home
          </button>
        </div>

        <p style={{ textAlign:'center', marginTop:20, fontSize:11, color:'var(--text-dim)', lineHeight:1.5 }}>
          AllerAI uses OCR to read food labels. Always consult a medical professional for severe allergies. Results may not be 100% accurate.
        </p>
      </div>
    </div>
  )
}

// QuickPickResultPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuickPickResultPage.css';
import MenuDetailModal from '../components/MenuDetailModal';
import axios from 'axios';
import { API_BASE_URL } from '../api/api';

const INGREDIENT_CATEGORIES = {
  "달걀": ["계란", "달걀", "에그", "지단", "오믈렛", "스크램블", "에그마요", "계란찜", "계란말이", "계란후라이", "계란볶음", "달걀찜", "타마고", "계란탕", "계란국", "에그드랍", "깜파뉴", "마요네즈", "계란구이", "전", "부침", "에그베네딕트", "휘낭시에", "쿠키", "돈가스", "김밥"],
  "갑각류": ["새우", "게", "랍스터", "크랩", "꽃게", "대게", "킹크랩", "소프트크랩", "새우살", "홍게", "게살", "게장", "간장게장", "양념게장", "가재", "소프틱크랩", "민물새우", "바닷가재", "새우까스", "새우완자", "새우전", "모듬해물", "칠리새우", "마늘새우", "버터새우", "해물요리", "감바스", "쉬림프"],
  "밀": ["빵", "파스타", "면", "라면", "우동", "만두", "피자", "떡국", "튀김", "국수", "짜장면", "부대찌개", "돈가스", "버거", "케이크"],
  "땅콩/대두": ["두부", "된장", "콩국수", "콩나물", "간장", "고추장", "쌈장", "유부", "두유"],
  "고기": ["소고기", "돼지고기", "닭고기", "삼겹살", "소시지", "스테이크", "치킨", "제육", "햄", "곱창", "내장"],
  "우유": ["우유", "요거트", "치즈", "크림", "버터", "라떼"],
  "버섯": ["버섯", "표고버섯", "팽이버섯", "느타리버섯", "양송이버섯", "송이버섯", "새송이버섯"],
  "고수": ["고수", "실란트로"],
  "내장": ["곱창", "막창", "대창", "염통", "내장"],
  "닭발": ["닭발"],
  "카페인": ["커피", "콜라", "에너지음료", "홍차", "녹차"]
};

const DISEASE_RULES = {
  "고혈압": ["간장", "된장", "햄", "소시지", "소금", "고기", "곱창", "내장", "삼겹살"],
  "저혈압": ["커피", "콜라", "에너지음료"],
  "당뇨": ["설탕", "시럽", "크림", "케이크", "빵"],
  "신장질환": ["된장", "소금", "소시지", "햄", "고기", "치즈"]
};

const ALLERGY_GROUPS = ["달걀", "갑각류", "밀", "땅콩/대두", "고기", "콩", "우유"];
const DISEASE_GROUPS = Object.keys(DISEASE_RULES);

function normalize(str) {
  return str.trim().toLowerCase();
}

function categorizeIngredient(ingredient, preferences) {
  const normalized = normalize(ingredient);
  const normalizedAllergies = (preferences.allergies || preferences.allergy || []).map(normalize);
  const normalizedDiseases = (preferences.diseases || preferences.disease || []).map(normalize);

  for (const category in INGREDIENT_CATEGORIES) {
    const words = INGREDIENT_CATEGORIES[category].map(normalize);
    if (words.includes(normalized)) {
      const isAllergy = normalizedAllergies.includes(normalize(category));
      const restrictedBy = normalizedDiseases.filter(disease => (DISEASE_RULES[disease] || []).map(normalize).includes(normalized));

      if (ALLERGY_GROUPS.map(normalize).includes(normalize(category)) && isAllergy) {
        console.log(`⚠️ 알러지 분류: ${ingredient} (${category})`);
      }
      if (restrictedBy.length > 0) {
        console.log(`⚠️ 질병 분류: ${ingredient} → ${restrictedBy.join(", ")}`);
      }

      return {
        category,
        like: preferences.likes?.includes(category),
        dislike: preferences.dislikes?.includes(category),
        allergy: isAllergy,
        restrictedBy
      };
    }
  }

  const fallbackRestrictions = normalizedDiseases.filter(disease => (DISEASE_RULES[disease] || []).map(normalize).includes(normalized));
  if (fallbackRestrictions.length > 0) {
    console.log(`⚠️ 질병 분류(카테고리 없음): ${ingredient} → ${fallbackRestrictions.join(", ")}`);
  }

  return {
    category: null,
    like: false,
    dislike: false,
    allergy: false,
    restrictedBy: fallbackRestrictions
  };
}

function getReason(menu, preferences) {
  const liked = new Set();
  const disliked = new Set();
  const allergic = new Set();
  const restricted = new Map();

  menu.ingredients.forEach(ing => {
    const analysis = categorizeIngredient(ing, preferences);
    if (analysis.like) liked.add(ing);
    if (analysis.dislike) disliked.add(ing);
    if (analysis.allergy) allergic.add(ing);
    analysis.restrictedBy.forEach(disease => {
      restricted.set(ing, disease);
    });
  });

  return {
    liked: Array.from(liked),
    disliked: Array.from(disliked),
    allergic: Array.from(allergic),
    restricted: Array.from(restricted.entries())
  };
}

function calculatePreferencePercentage(menu, preferences) {
  for (const ingredient of menu.ingredients) {
    const result = categorizeIngredient(ingredient, preferences);
    if (result.restrictedBy.length > 0 || result.allergy) return 0;
  }

  let score = 40;
  let totalPenalty = 0;
  let likeBonus = 0;

  for (const ingredient of menu.ingredients) {
    const result = categorizeIngredient(ingredient, preferences);
    if (result.dislike) totalPenalty += 15;
    if (result.like) likeBonus += 30;
  }

  score += likeBonus - totalPenalty;
  score += Math.floor(Math.random() * 11) - 5;
  return Math.max(0, Math.min(score, 100));
}

export {
  INGREDIENT_CATEGORIES,
  DISEASE_RULES,
  ALLERGY_GROUPS,
  DISEASE_GROUPS,
  normalize,
  categorizeIngredient,
  getReason,
  calculatePreferencePercentage
};

function QuickPickResultPage() {
  const [nickname, setNickname] = useState("(닉네임)");
  const [percentage, setPercentage] = useState(0);
  const [targetPercentage, setTargetPercentage] = useState(0);
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0);
  const [preferences, setPreferences] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ menuName: "", percentage: 0, reason: "" });
  const navigate = useNavigate();

  const menus = [
    { name: "삼겹살", image: "/samgyeopsal.png", ingredients: ["삼겹살", "쌈장", "고기"] },
    { name: "버섯덮밥", image: "/beoseot_deopbap.png", ingredients: ["밥", "양송이버섯", "간장", "버섯"] },
    { name: "쌀국수", image: "/pho.png", ingredients: ["소고기", "숙주", "고수", "면", "밀"] },
    { name: "무뼈닭발", image: "/dakbal.png", ingredients: ["닭발", "고기", "고추장"] },
    { name: "해물찜", image: "/haemuljjim.png", ingredients: ["새우", "꽃게", "문어"] },
    { name: "스시", image: "/eggroll.png", ingredients: ["해산물"] },
    { name: "양꼬치", image: "/tofu.png", ingredients: ["양고기", "고기"] },
    { name: "크림파스타", image: "/cream_pasta.png", ingredients: ["면", "우유", "치즈", "크림"] },
    { name: "버거", image: "/burger.png", ingredients: ["빵", "고기", "치즈", "소스"] },
    { name: "치킨", image: "/chicken.png", ingredients: ["닭고기", "튀김옷", "고기", "밀"] },
    { name: "짜장면", image: "/jajangmyeon.png", ingredients: ["면", "춘장", "고기", "밀"] },
    { name: "떡볶이", image: "/tteokbokki.png", ingredients: ["떡", "고추장", "밀"] },
    { name: "마라탕", image: "/malatang.png", ingredients: ["고기", "버섯", "양고기", "고수"] },
    { name: "찜닭", image: "/jjimdak.png", ingredients: ["닭고기", "간장", "고기"] },
    { name: "육회비빔밥", image: "/yukhoe_bibimbap.png", ingredients: ["육회", "밥", "고기", "달걀"] }
  ];

  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) return;
    axios.get(`${API_BASE_URL}/user/${username}`)
      .then(res => setNickname(res.data.name || username))
      .catch(err => console.error("유저 정보 불러오기 실패:", err));
  }, [username]);

  useEffect(() => {
    if (!username) return;
    axios.get(`${API_BASE_URL}/mypage/${username}`)
      .then(res => {
        setPreferences(res.data.preferences);
        localStorage.setItem("userPreferences", JSON.stringify(res.data.preferences));
      })
      .catch(err => {
        console.error("선호 정보 불러오기 실패:", err);
        setPreferences({ likes: [], dislikes: [] });
      });
  }, [username]);

  useEffect(() => {
  if (!preferences) return;
  console.log("[디버깅] preferences 데이터:", preferences);
  window.debugPreferences = preferences; // 콘솔에서 접근 가능
}, [preferences]);  

  useEffect(() => {
    if (!preferences) return;
    const currentMenu = menus[currentMenuIndex];
    const calculatedPercentage = calculatePreferencePercentage(currentMenu, preferences);
    setTargetPercentage(calculatedPercentage);
    setPercentage(0);

    const interval = setInterval(() => {
      setPercentage(prev => {
        if (prev < calculatedPercentage) return prev + 1;
        clearInterval(interval);
        return calculatedPercentage;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [currentMenuIndex, preferences]);

  const showNextMenu = () => setCurrentMenuIndex((prev) => (prev + 1) % menus.length);
  const goToHome = () => navigate('/home');
  const viewDetail = () => {
    const currentMenu = menus[currentMenuIndex];
    const reason = getReason(currentMenu, preferences, targetPercentage);
    setModalInfo({ menuName: currentMenu.name, percentage: targetPercentage, reason });
    setIsModalOpen(true);
  };

  const currentMenu = menus[currentMenuIndex];

  return (
    <div className="page-container">
      <h2 className="result-title">
        <span className="brown">랜덤 메뉴 추천</span>
        <span className="pink"> 완료!</span>
      </h2>

      <div className="result-circle">
        <div className="circle-fill" style={{ height: `${percentage}%` }}></div>
        <div className="circle-inner">
          <img src={currentMenu.image} alt="메뉴" className="menu-image" />
          <h2>{currentMenu.name}</h2>
          <p>{percentage}%</p>
        </div>
      </div>
      <p className="description">
        <span className="nickname">{nickname}</span>님의 선호가<br/> <span className="percentage">{percentage}%</span> 반영된 오늘의 랜덤 메뉴에요!
        <span className="detail-link" onClick={viewDetail}>추천 상세 보기 &gt;</span>
      </p>
      <div className="result-buttons">
        <button className="common-button other-menu" onClick={showNextMenu}>다른 메뉴</button>
        <button className="common-button main-button" onClick={goToHome}>메인으로</button>
      </div>
      <MenuDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} menuName={modalInfo.menuName} percentage={modalInfo.percentage} reason={modalInfo.reason} />
    </div>
  );
}

export default QuickPickResultPage;
export type Suspect = {
    id: number;
    name: string;
    age: number;
    job: string;
    description: string;
    imageKey?: string; // 추후 초상화 이미지
};

export const SUSPECTS: Suspect[] = [
    {
        id: 1,
        name: "김덕수",
        age: 48,
        job: "노숙자",
        description:
            "낡은 점퍼와 해진 운동화. 생활용품이 든 큰 비닐봉지를 여러 개 들고 다닌다.",
    },
    {
        id: 2,
        name: "이해인",
        age: 36,
        job: "은행원",
        description: "착하고 순함, 부탁하면 다 들어줌, 거절 잘 못함.",
    },
    {
        id: 3,
        name: "사서강",
        age: 30,
        job: "사서",
        description:
            "단정하고 친절함. 예의 바르고 사서라는 직업적 이미지로 인한 좋은 평판..",
    },
    {
        id: 4,
        name: "오재",
        age: 45,
        job: "요구르트 판매원",
        description:
            "마을의 악동(?), 가끔 선을 넘는 장난으로 은근히 미움을 사고 있음.",
    },
    {
        id: 5,
        name: "반종원",
        age: 31,
        job: "요리사",
        description:
            "동네에서 소문난 이탈리안 음식점 셰프로 동네 사람들 사이에서 예의바르고 재치있기로 유명함.",
    },
    {
        id: 6,
        name: "이윤지",
        age: 26,
        job: "교대생",
        description:
            "그냥 엄친딸 예쁘고 교대생이라서 평판 좋음 과묵하고 분위기 있는 느좋녀",
    },
    {
        id: 7,
        name: "무명남",
        age: 30,
        job: "???",
        description: "누군지 모르궜다",
    },
    {
        id: 8,
        name: "무명녀",
        age: 39,
        job: "???",
        description: "누군지 모르궜다",
    },
];


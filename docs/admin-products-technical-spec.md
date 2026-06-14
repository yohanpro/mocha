# 관리자 상품 등록/수정 — 기술 설계 문서

> 작성일: 2026-06-13 | 대상: `app/(admin)/dashboard/products/*`

관리자가 상품을 등록·수정·상태변경(판매중/품절/숨김)하는 화면. 이미지는 **URL 입력 방식**(파일 업로드 아님).

---

## 1. 라우팅

```
/dashboard/products         → 목록 (전체, hidden 포함)
/dashboard/products/new     → 등록 폼
/dashboard/products/[id]    → 수정 폼
```

> `new`(정적)가 `[id]`(동적)보다 우선이라 충돌 없음 — Next.js 라우트 우선순위.

---

## 2. 데이터 조회 — 관리자용 전체 조회

소비자용 `getProducts()`는 `status != hidden`만 가져온다. 관리자는 숨김 상품도 봐야 하므로 **별도 함수**를 둔다.

```ts
// src/entities/product/api.ts
export async function getAllProducts(): Promise<Product[]> {
  return supabase.from("products").select("*").order("created_at", { ascending: false });
}
```

RLS: `products_select`는 `using (true)`라 조회 자체는 누구나 가능. 관리자 영역 접근은 `proxy.ts` 게이트가 막는다.

---

## 3. 컴포넌트 구조 (FSD)

```
app/(admin)/dashboard/products/
  ├─ page.tsx          ← 목록 (Server, getAllProducts)
  ├─ new/page.tsx      ← <ProductForm />
  └─ [id]/page.tsx     ← getProduct(id) → <ProductForm product={...} />, 없으면 notFound()

src/features/manage-product/
  ├─ ui/ProductForm.tsx        ← "use client", 등록/수정 공용
  └─ api/saveProduct.ts        ← "use server", create/edit 통합
```

---

## 4. 등록/수정 통합 액션

하나의 `saveProduct`가 `formData.id` 유무로 분기한다.

```ts
const id = formData.get("id");           // 수정 폼에만 hidden input으로 존재
const { error } = id
  ? await supabase.from("products").update(row).eq("id", id)   // 수정
  : await supabase.from("products").insert(row);               // 등록
revalidatePath("/dashboard/products");
redirect("/dashboard/products");
```

폼은 `useActionState(saveProduct, ...)` 하나로 두 모드를 다룬다. 수정 모드는 `<input type="hidden" name="id">` + 각 필드 `defaultValue`로 prefill.

---

## 5. 입력 검증 (서버에서)

클라이언트 `required`/`min`은 UX 보조일 뿐, **신뢰의 경계는 서버액션**이다.

```ts
if (!name) return { error: "상품명을 입력하세요." };
if (!Number.isFinite(price) || price < 0) return { error: "가격을 0 이상으로 입력하세요." };
if (!Number.isFinite(stock) || stock < 0) return { error: "재고를 0 이상으로 입력하세요." };
if (!STATUSES.includes(status)) return { error: "잘못된 상태값입니다." };
```

`price`/`stock`은 `Number()` 파싱 후 `Math.round()`로 정수화(DB는 `integer`).

---

## 6. 이미지 — URL 입력 (업로드 아님)

`image_url` 텍스트 필드. 현재 모든 상품 이미지가 외부 URL(Unsplash)이고, **Storage 버킷이 라이브에 없어서**(→ pair-notes §1) MVP는 URL 방식으로 간다. 파일 업로드는 추후 버킷 생성 후 별도 작업.

목록 썸네일·소비자 카드 모두 plain `<img>`(eslint-disable)라 `next/image` 도메인 허용과 무관.

---

## 7. 검증 결과 (2026-06-13)

| 흐름 | 결과 |
|---|---|
| 목록 (hidden 포함, 상태 배지) | ✅ |
| 등록 → 리다이렉트 → 목록 상단 노출 | ✅ |
| 수정 폼 prefill | ✅ |
| 상태 변경(판매중→품절) 저장·반영 | ✅ |
| 테스트 데이터 정리 | ✅ (생성한 테스트 상품 삭제) |

---

## 8. 다음

- 파일 업로드(버킷 생성 후) — 피드 등록과 공용 업로드 로직으로.
- 목록 상태 필터/검색(상품 많아지면).
- seed 중복 상품 정리(현재 DB에 동일 상품 다수).

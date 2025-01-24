## Component Props

```typescript
interface BarberCardProps {
  barber: Barber; // egy barber adatai, a Props hozzá van kötve a BarberCard interfacehez szoval ugyanazokat az adatokat fogja visszakapni mint amit a Barber interfaceben van
  onSelect: () => void; // Callback fanksun amikor kiválasztasz egy barbert, azért void mert nincs returnje, ez az onselect peldaul a barberselection.tsx-ben van megirva hogy atvisz a booking-formra
}
```

## State Management

### Primary States

```typescript
const [showReviews, setShowReviews] = useState(false);
const [showReferences, setShowReferences] = useState(false);
const [selectedReference, setSelectedReference] = useState<Reference | null>(
  null
);
const [reviews, setReviews] = useState<Review[]>([]);
const [references, setReferences] = useState<Reference[]>([]);
const [reviewCount, setReviewCount] = useState(0);
const [isLoadingReviews, setIsLoadingReviews] = useState(false);
const [isLoadingReferences, setIsLoadingReferences] = useState(false);
```

A useState arra van használva hogy 'state'-eket tudjunk tárolni benne és állítani azokat. Mindig van egy érték ami tárolja a state-t és egy függvény ami állítja.

- `showReviews`: Ez azt tárolja hogy a showreviews true vagy false-e, látod a kódban is hogy alapból falsera van állítva. A setShowReviews állítja be hogy láthatóak-e a vélemények.

- `reviews`: A reviews tárolja egy adott barberről a véleményeket, és a useState<Review[]>([]) annyit jelent hogy a review objektumbból csinálunk egy tömböt, azért van mellette a '[]'. A setReviews a fetch után fut le, és a kapott adatokat állítja be a reviews tömbbe.

- `reviewCount`: alapból 0ra van allitva és ugyanúgy egy fetch után állítja be a vélemények számát.

- `isLoadingReviews`: Ez kinda unalmas amikor a véleményeket betölti és nem egyből akkor van egy ilyen kis loading state hogy "betöltés..."
  uncsi

## Side Effects

### Review Count Fetching

```typescript

A useEffect nem ugyanaz mint a useState, mert a useStatenek a dolga hogy eltároljon adatokat mint pl a vélemények számát. A useEffect pedig mindig lefut egy adott adat alapján, például ennek a useEffectnek meg van adva, hogy a barber.id alapján fusson le.

useEffect(() => {
  const getReviewCount = async () => { // Async függvény olyan mint egy sima csak egy kicsit jobb. Egy sima függvény lefagyasztja a kódot és akkor megy csak tovább a kód ha a függvény véget ért. Az async függvényeknek van egy returnje ami egy promise-t ad vissza mindig, és lehet várakoztatni a függvényen az await-el.
    try { // sima try catch semmi extra, ha nem sikerül a fetch akkor a catch ág fut le.
      const response = await fetchReviews(barber.id);
      if (response && response.data) {
        setReviewCount(response.data.length);
      }
    } catch (error) {
      console.error("Failed to fetch review count:", error);
    }
  };

  getReviewCount(); // meghívjuk az async függvényt
}, [barber.id]); // ez azt jelenti hogy ez a useEffect mindig lefut amikor a barber.id változik
```

### Reviews Fetching

```typescript
useEffect(() => {
  if (showReviews) {
    const getReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const response = await fetchReviews(barber.id);
        if (response && response.data) {
          setReviews(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    getReviews();
  }
}, [showReviews, barber.id]);
```

### References Fetching

```typescript
useEffect(() => {
  if (showReferences) {
    const getReferences = async () => {
      setIsLoadingReferences(true);
      try {
        const response = await fetchReferences(barber.id);
        if (response && response.data) {
          setReferences(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch references:", error);
        setReferences([]);
      } finally {
        setIsLoadingReferences(false);
      }
    };

    getReferences();
  }
}, [showReferences, barber.id]);
```

## Helper Functions

### Star Rating Renderer

```typescript
const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= rating ? (
        <FaStar key={i} className="text-yellow-500" />
      ) : (
        <FaRegStar key={i} className="text-yellow-500" />
      )
    );
  }
  return stars;
};
```

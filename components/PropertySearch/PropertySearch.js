import { useEffect, useState } from "react";
import { Results } from "./Results.js";
import { Pagination } from "./Pagination/Pagination.js";
import { useRouter } from "next/router.js";
import queryString from "query-string";
import { Filters } from "./Filters/Filters.js";

export const PropertySearch = () => {
  const [properties, setProperties] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const router = useRouter();

  const pageSize = 3;

  const search = async () => {
    const { page, minPrice, maxPrice, hasParking, petFriendly } =
      queryString.parse(window.location.search); //36. lekcija , 4ti minuit

    const filters = {};
    if (minPrice) {
      filters.minPrice = parseInt(minPrice); //prebacujemo u ono sto wp ocekuje, posto je sve string sto user ukuca u input/search
    }
    if (maxPrice) {
      filters.maxPrice = parseInt(maxPrice);
    }
    if (hasParking === "true") {
      filters.hasParking = true;
    }
    if (petFriendly === "true") {
      filters.petFriendly = true;
    }

    const response = await fetch(`/api/search`, {
      method: "POST",
      body: JSON.stringify({
        page: parseInt(page || 1),
        ...filters,
      }),
    });

    const data = await response.json();
    console.log("SEARCH DATA", data);
    setProperties(data.properties);
    setTotalResults(data.total);
  };

  const handlePageClick = async (pageNumber) => {
    const { petFriendly, hasParking, minPrice, maxPrice } = queryString.parse(
      window.location.search
    );

    await router.push(
      //old query before lek 40
      // `${router.query.slug.join("/")}?page=${pageNumber}`,
      `${router.query.slug.join(
        "/"
      )}?page=${pageNumber}&petFriendly=${petFriendly === "true"}&hasParking=${hasParking === "true"}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
      null,
      { shallow: true }
    );
    search();
  };

  useEffect(() => {
    search();
  }, []);

  const handleSearch = async ({
    petFriendly,
    hasParking,
    minPrice,
    maxPrice,
  }) => {
    // update our browser url
    // search
    console.log("FILTERS: ", petFriendly, hasParking, minPrice, maxPrice);
    await router.push(
      `${router.query.slug.join(
        "/"
      )}?page=1&petFriendly=${!!petFriendly}&hasParking=${!!hasParking}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
      null,
      {
        shallow: true,
      }
    );
    search();
  };

  return (
    <div>
      <Filters onSearch={handleSearch} />
      <Results properties={properties} />
      <Pagination
        onPageClick={handlePageClick}
        totalPages={Math.ceil(totalResults / pageSize)}
      />
    </div>
  );
};

import { gql } from "@apollo/client";
import client from "client";
const handler = async (req, res) => {
  try {
    const filters = JSON.parse(req.body);

    let hasParkingFilter = ``;
    let petFriendlyFilter = ``;
    let minPriceFilter = ``;
    let maxPriceFilter = ``;

    if (filters.hasParking) {
      hasParkingFilter = `
      {
        key: "has_parking"
        compare: EQUAL_TO
        value: "1"
      },
      `;
    }

    if (filters.petFriendly) {
      petFriendlyFilter = `
      {
        key: "pet_friendly"
        compare: EQUAL_TO
        value: "1"
      },
      `;
    }

    if (filters.minPrice) {
      minPriceFilter = `
      {
        key: "price"
        compare: GREATER_THAN_OR_EQUAL_TO
        value: "${filters.minPrice}"
        type: NUMERIC
      }
      `;
    }
    if (filters.maxPrice) {
      maxPriceFilter = `
      {
        key: "price"
        compare: LESS_THAN_OR_EQUAL_TO
        value: "${filters.maxPrice}"
        type: NUMERIC
      }
      `;
    }

    const { data } = await client.query({
      query: gql`
        query AllPropertiesQuery {
          properties(where: { offsetPagination: { size: 3, offset: ${
            ((filters.page || 1) - 1) * 3 //36 lek, 7 min da znas zasto je ovako, kod alana je kurs
          } }
        
          metaQuery: {
            relation: AND
            metaArray: [
              ${petFriendlyFilter}
              ${hasParkingFilter}
              ${minPriceFilter}
              ${maxPriceFilter}
            ]
          }
        }) {
            pageInfo {
              offsetPagination {
                total
              }
            }
            nodes {
              databaseId
              title
              uri
              featuredImage {
                node {
                  sourceUrl
                  uri
                }
              }
              propertyFeatures {
                bathrooms
                bedrooms
                price
                petFriendly
                hasParking
              }
            }
          }
        }
      `,
    });

    return res.status(200).json({
      total: data.properties.pageInfo.offsetPagination.total,
      properties: data.properties.nodes, // ovako zasto sto vidis da to treba da return iz GraphQL exntensiona  u wp, lekcija 33, 5:36 min
    });
  } catch (e) {
    console.log("ERROR: " + e);
  }
};

export default handler;

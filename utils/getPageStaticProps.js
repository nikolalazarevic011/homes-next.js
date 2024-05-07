import { gql } from "@apollo/client";
import client from "client";
import { cleanAndTransformBlocks } from "./cleanAndTransformBlocks";
import { mapMainMenuItems } from "./mapMainMenuItems";

export const getPageStaticProps = async (context) => {
  console.log("Context: ", context);

   //we can get uri/url
  //! gledamo dal ima slug, ako nema znaci da je home page
  const uri = context.params?.slug ? `/${context.params.slug.join("/")}/` : "/";

  const { data } = await client.query({
    query: gql`
      query PageQuery($uri: String!) {
        nodeByUri(uri: $uri) {
          ... on Page {
            id
            blocks(postTemplate: false)
          }
          ... on Property {
            id
            blocks(postTemplate: false)
          }
        }
        acfOptionsMainMenu {
          mainMenu {
            callToActionButton {
              destination {
                ... on Page {
                  uri
                }
              }
              label
            }
            menuItems {
              items {
                destination {
                  ... on Page {
                    uri
                  }
                }
                label
              }
              menuItem {
                destination {
                  ... on Page {
                    uri
                  }
                }
                label
              }
            }
          }
        }
      }
    `,
    variables: {
        uri,
      },
  });

  return {
    props: {
      mainMenuItems: mapMainMenuItems(
        data.acfOptionsMainMenu.mainMenu.menuItems
      ),
      callToActionLabel:
        data.acfOptionsMainMenu.mainMenu.callToActionButton.label,
      callToActionDestination:
        data.acfOptionsMainMenu.mainMenu.callToActionButton.destination.uri,
      blocks: cleanAndTransformBlocks(data.nodeByUri.blocks),
    },
  };
};

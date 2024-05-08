import { gql } from "@apollo/client";
import client from "client";
import { BlockRenderer } from "components/BlockRenderer";
import { MainMenu } from "components/MainMenu";
import { cleanAndTransformBlocks } from "utils/cleanAndTransformBlocks";
import { getPageStaticProps } from "utils/getPageStaticProps";
import { mapMainMenuItems } from "utils/mapMainMenuItems";
import {Page} from '../components/Page'

export default Page

export const getStaticProps = getPageStaticProps
import { BlockRenderer } from "components/BlockRenderer";
import { getPage } from "utils/getPage";
import { notFound } from "next/navigation";

export default async function Page({params}) {
  const data = await getPage(params.slug.join('/'));
  if (!data) {
    //lek 59, ako ne postoji route
    notFound();
  }


  console.log(data);

  return <BlockRenderer blocks={data} />;
}

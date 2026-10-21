// Canonical URLs preserve path/query and method. Draft configs fail closed.
export function createCityWorker({publish,domain}) {
  return {async fetch(request,env) {
    if (!publish || !domain) return new Response('This site is not published.',{status:503,headers:{'X-Robots-Tag':'noindex, nofollow'}});
    const url=new URL(request.url);
    if(url.protocol!=='https:' || url.hostname!==domain) {
      url.protocol='https:';url.hostname=domain;url.port='';
      return Response.redirect(url.toString(),308);
    }
    return env.ASSETS.fetch(request);
  }};
}

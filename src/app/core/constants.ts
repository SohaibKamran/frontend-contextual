import { environment } from '../../environments/environment';
import { api } from '../../environments/environment';
export const ROLES = {
    VIEWER: 1,
    TAGGER: 2,
    ADMIN: 3
}

//User API routes
export const loginUrl = environment.userApi + '/login';
export const registerUrl = environment.userApi + '/signUp';
export const sendResetEmail = environment.userApi + "/resetPasswordEmail"
export const updatePassword = environment.userApi + "/resetPassword"
export const getAllCountries = environment.countryApi + "/getCountries"
//Tagger API routes
export const getProductsForTagger = environment.taggerApi + "/product/tagger/getProducts"
export const getRecentProxies = environment.taggerApi + "/proxyImages/recent"
export const getRecentSuperProxies = environment.taggerApi + "/proxyImages/recent" //"/superProxies/recent"
export const getCorrectUrlForPR = environment.taggerApi + "/cloud/gcp/refreshSignedUrl"
export const getActors = environment.taggerApi + "/actor/getActors"
export const getAllScenesOfShow = environment.taggerApi + "/scene/getScenes"
export const getProductsOfScene = environment.taggerApi + "/scene/getProducts"
export const addProductOfScene = environment.taggerApi + "/scene/tagProductInScene"
export const removeCoordinate = environment.taggerApi + "/scene/deleteCoordinate"
export const getAllShows = environment.showApi + "/getShows"
export const addTag = environment.taggerApi + "/tag/addTag"
export const getAllProducts = environment.taggerApi + "/product/getProducts"
export const getTags = environment.taggerApi + "/tag/getTags"
export const getFileBuffer = environment.baseUrlAdmin + '/api/misc/getBuffer'
//Home API routes
export const trendingVideos = environment.showApi + '/getTrendingShows';
export const classicVideos = environment.showApi + '/getClassicShows';
export const recentFavouriteVideos = environment.showApi + "/getFavoriteShows"
//Profile API routes
export const getProfileDetails = environment.userApi + "/profile/get"
export const updateProfileDetails = environment.userApi + "/profile/update"
//Wishlist API routes
export const addToWishlist = environment.userApi + "/wishlist/add"
export const getWishlistProducts = environment.userApi + "/wishlist/get"
export const removeFromWishlist = environment.userApi + "/wishlist/remove"
export const getLimitedWishlistProducts = environment.userApi + "/wishlist/get/limited"
// User favorite products
export const getFavorite = environment.userApi + "/wishlist/favorites"
export const getTrendigBrands = environment.taggerApi + "/advertiser/trending"
//Player API routes
export const getVideoByTitle = environment.videoApi + '/videByTitle';
export const getRecentFavVideos = environment.videoApi + '/recentfavourtieVideos';
export const getVideosadds = environment.videoApi + '/videoAds';
export const getVideoDetailByID = environment.showApi + '/getShowById';
export const getSceneProducts = environment.showApi + '/getCoordinatesAndProducts';
export const getSceneTopProducts = environment.taggerApi + '/scene/getSceneByIdAndTopAds';
export const getSeasonsAndEpisodes = environment.showApi + '/getSeasonsAndEpisodes';
export const getAdRetailersOfShow = environment.showApi + '/getAdRetailersOfShow';
//General API routes
export const getKeywords = api + '/misc/getKeywords';
export const getColors = api + '/product/getColors';
export const getGenders = api + '/product/getGenders';
export const eliminateGcpProducts = environment.baseUrlAdmin + '/api/product/eliminateProductsFromGCPSearch';
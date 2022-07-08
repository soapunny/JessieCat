const testUser = {
    username: "Soapunny",
    loggedIn: true,
}

export const showTrending = (req, res) => {
    const videos = [
        {
            title: "Bami is meowing",
            length: 128,
            date: "2022-07-06",
            like: 3,
            views: 11,
            id: "123a",
        },
        {
            title: "Friday is barking",
            length: 38,
            date: "2 mins ago",
            like: 7,
            views: 31,
            id: "123b",
        },
        {
            title: "Me, cleaning my house",
            length: 86,
            date: "2022-07-01",
            like: 0,
            views: 17,
            id: "123c",
        },
    ];
    res.render("home", {pageTitle: "Home", testUser, videos});
}
export const watchVideo = (req, res) => res.render("watchVideo", {pageTitle: "Watch Video", testUser, videoId: req.params.id});
export const editVideo = (req, res) => res.render("editVideo", {pageTitle: "Edit Video"});
export const deleteVideo = (req, res) => res.render("deleteVideo", {pageTitle: "Delete Video"});
export const uploadVideo = (req, res) => res.render("uploadVideo", {pageTitle: "Upload Video"});
export const searchVideo = (req, res) => res.render("searchVideo", {pageTitle: "Search Video"});
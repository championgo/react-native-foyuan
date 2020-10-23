import { Platform, Dimensions, PixelRatio, StatusBar } from "react-native";

export default {
    baseColor: "#66bfb8",
    baseBackgroundColor: "#f8f8f8",
    screenHeight: Dimensions.get("window").height,
    screenWidth: Dimensions.get("window").width,
    headerTintColor: "#fff",
    tabbar: {
        inactiveTintColor: "#cfd0d7",
        activeTintColor: "#66bfb8",
    },
    colorEc6025: '#EC6025',
    color6c75d: '#6C757D',
    color333: '#333',
    color666: '#666',
    color999: '#999',
    color173ACC: '#173ACC',
    colorEee: '#eee',
    colorCd: '#cdcdcd',
    colorA0: '#A0A0A0',
    colorF2: 'rgba(242,242,242,1)',
    color53: '#535353',
    colorBlack: '#000',
    colorWhite: '#fff',
    agendaTheme: {
        calendarBackground: "#173ACC",
        textSectionTitleColor: 'rgba(255,255,255,0.6)',
        textDisabledColor: 'rgba(255,255,255,0.3)',
        selectedDayBackgroundColor: '#fff',
        selectedDayTextColor: '#1E4A9A',
        dayTextColor: "#fff",
        todayTextColor: '#fff',
        todayBackgroundColor: 'rgba(255,255,255,0.3)',
        monthTextColor: '#fff',
        indicatorColor: '#fff',
        agendaKnobColor: 'rgba(255,255,255,0.3)'
    }
};

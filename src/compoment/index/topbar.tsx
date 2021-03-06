import React from 'react';

import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';

import IndexPage from '../Page/File'


const drawerWidth = 0;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        flexGrow: {
            flexGrow: 1
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            // padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -(drawerWidth / 4),
            // marginTop: 10,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
        title: {
            flexGrow: 1,
            color: '#ffffff'
        },
    }),
);

const PersistentDrawerLeft = (props: any) => {
    const classes = useStyles();
    // const theme = useTheme();
    const [open] = React.useState(true);
    // const { route } = props;

    // const handleDrawerOpen = () => {
    //     setOpen(true);
    // };

    // const handleDrawerClose = () => {
    //     setOpen(false);
    // };

    // let u = Math.ceil(Math.random() * 100000)

    // let avatat = "https://avatars1.githubusercontent.com/u/".concat(String(u))

    return (
        <div className={classes.root}>
            <div className="content">
            </div>
            <CssBaseline />
            {/* <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Photos
                    </Typography>
                    <div className={classes.flexGrow} />
                    <Hidden mdDown>
                        <Link href="/logout" color="inherit">退出</Link>
                    </Hidden>
                </Toolbar>
            </AppBar> */}

            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <main className={classes.content}>
                    {/* <Suspense fallback={<LinearProgress />}>
                        {renderRoutes(route.routes)}
                    </Suspense> */}
                    <IndexPage></IndexPage>
                </main>
            </main>
        </div>
    );
}

PersistentDrawerLeft.propTypes = {
    route: PropTypes.object
};
export default PersistentDrawerLeft
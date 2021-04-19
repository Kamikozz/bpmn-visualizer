import React, { useState, useRef, useEffect } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectRoles } from '../../features/roles/rolesSlice';
import { selectActions } from '../../features/actions/actionsSlice';
import { selectRoleActionMap } from '../../features/roleActionMap/roleActionMapSlice';
import { selectBPRelations } from '../../features/bpRelations/bpRelationsSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'auto',
    },
    workspace: {
      display: 'flex',
      height: '100%',
      border: '1px solid black',
    },
    role: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 30,
      padding: '25px 0px',
      // overflow: 'hidden',
      writingMode: 'vertical-lr',
      transform: 'rotate(180deg)',
      border: '1px solid black',
    },
    processesContainer: {
      display: 'flex',
      // flexWrap: 'wrap',
    },
    process: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      height: 'calc(50% - 10px * 2 - 8px * 2)',
      margin: '10px',
      padding: '8px',
      borderRadius: '50%',
      border: '1px solid black',
      fontSize: 12,
      overflow: 'hidden',
      backgroundColor: 'white',
      zIndex: 1,
    },
    svg: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
  }),
);

export default function RelationsCreator() {
  const classes = useStyles();
  const roles = useAppSelector(selectRoles);
  const actions = useAppSelector(selectActions);
  const roleActionMap = useAppSelector(selectRoleActionMap);
  const bpRelations = useAppSelector(selectBPRelations);
  const dispatch = useAppDispatch();

  const fromRef = useRef<HTMLDivElement | null>(null);
  const toRef = useRef<HTMLDivElement | null>(null);

  const getPointCenterCoords = (ref: any) => {
    if (!ref || !ref.current) return [undefined, undefined];
    const element = ref.current;
    const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = element;
    const x = Number(offsetLeft) + Number(offsetWidth) / 2;
    const y = Number(offsetTop) + Number(offsetHeight) / 2;
    return [x, y];
  };

  const [centerX, centerY] = getPointCenterCoords(fromRef);
  const [centerToX, centerToY] = getPointCenterCoords(toRef);

  let width;
  let height;

  if (centerX !== undefined
    && centerToX !== undefined
    && centerY !== undefined
    && centerToY !== undefined) {
    width = Math.max(centerX, centerToX);
    height = Math.max(centerY, centerToY);
  }

  const rolesArrayIds = Object.keys(roles);
  const roleActionMapArrayIds = Object.keys(roleActionMap);
  // console.log(bpRelations, roleActionMapArrayIds, rolesArrayIds);
  // console.log(roleActionMap[roleActionMapArrayIds[0]], roles);
  // console.log(roleActionMapArrayIds, roleActionMap[roleActionMapArrayIds[0]]);

  const isRefsInitialized = width !== undefined && height !== undefined;

  return (
    <>
      <div className={classes.root}>
        {
          rolesArrayIds.map((roleId) => {
            const { name: roleName } = roles[roleId];
            return (
              <div key={roleId} className={classes.workspace}>
                <div className={classes.role}>{roleName}</div>
                <div className={classes.processesContainer}>
                  {
                    roleActionMapArrayIds.map((roleActionRelationId) => {
                      const roleActionRelation = roleActionMap[roleActionRelationId];
                      const { actionId, roleId: relationRoleId } = roleActionRelation;
                      if (roleId === relationRoleId) {
                        const { name: actionName } = actions[actionId];
                        return (
                          <div key={roleActionRelationId} ref={fromRef} className={classes.process}>{actionName}</div>
                        );
                      }
                    })
                  }
                </div>
              </div>
            );
          })
        }
        {
          isRefsInitialized &&
          <svg
            className={classes.svg}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
          >
            <defs>
              <marker id="arrowhead" viewBox="0 0 10 10" refX="3" refY="5"
              markerWidth="7" markerHeight="7" orient="auto">
                <path fill="white" stroke="black" d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
            </defs>
            <g fill="none" stroke="black" strokeWidth="2" markerMid="url(#arrowhead)">
              <polyline
                points={`${centerX},${centerY} ${(Number(centerX) + Number(centerToX)) / 2},${(Number(centerY) + Number(centerToY)) / 2} ${centerToX},${centerToY}`}
                // d={`M ${centerX},${centerY} L ${centerToX},${centerToY}`}
              />
            </g>
          </svg>
        }
      </div>

{/*
      <div className={classes.root}>
        <div className={classes.workspace}>
          <div className={classes.role}>Кто-то</div>
          <div ref={fromRef} className={classes.process}>
            Сделать что-то
          </div>
        </div>

        <div className={classes.workspace}>
          <div className={classes.role}>Гриша</div>
          <div className={classes.process}>
            Сделать что-то2
          </div>
          <div ref={toRef} className={classes.process}>
            Сделать что-то3
          </div>
        </div>

        {
          isRefsInitialized &&
          <svg
            className={classes.svg}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
          >
            <defs>
              <marker id="arrowhead" viewBox="0 0 10 10" refX="3" refY="5"
              markerWidth="7" markerHeight="7" orient="auto">
                <path fill="white" stroke="black" d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
            </defs>
            <g fill="none" stroke="black" strokeWidth="2" markerMid="url(#arrowhead)">
              <polyline
                points={`${centerX},${centerY} ${(Number(centerX) + Number(centerToX)) / 2},${(Number(centerY) + Number(centerToY)) / 2} ${centerToX},${centerToY}`}
                // d={`M ${centerX},${centerY} L ${centerToX},${centerToY}`}
              />
            </g>
          </svg>
        }
      </div> */}
    </>
  );
}

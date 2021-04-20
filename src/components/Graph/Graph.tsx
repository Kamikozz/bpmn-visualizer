import React, { useState, useRef, useEffect } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { useAppSelector } from '../../store/hooks';
import { selectRoles } from '../../store/roles/rolesSlice';
import { selectActions } from '../../store/actions/actionsSlice';
import { selectRoleActionMap } from '../../store/roleActionMap/roleActionMapSlice';
import { selectBPRelations } from '../../store/bpRelations/bpRelationsSlice';

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
      writingMode: 'vertical-lr',
      transform: 'rotate(180deg)',
      borderLeft: '1px solid black',
    },
    processesContainer: {
      display: 'flex',
      alignItems: 'center',
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

  const itemsRef = useRef<any>({});

  const rolesArrayIds = Object.keys(roles);
  const roleActionMapArrayIds = Object.keys(roleActionMap);
  const bpRelationsArrayIds = Object.keys(bpRelations);

  const getPointCenterCoords = (element: any) => {
    const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = element;
    const x = Number(offsetLeft) + Number(offsetWidth) / 2;
    const y = Number(offsetTop) + Number(offsetHeight) / 2;
    return [x, y];
  };

  return (
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
                        <div
                          key={roleActionRelationId}
                          ref={(el) => itemsRef.current[roleActionRelationId] = el}
                          className={classes.process}
                        >{actionName}</div>
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
        bpRelationsArrayIds
          .map((bpRelationId) => {
            const [relationFromId, relationToId] = bpRelations[bpRelationId].relation;

            const relationFromEl = itemsRef.current[relationFromId];
            const relationToEl = itemsRef.current[relationToId];

            const [centerX, centerY] = getPointCenterCoords(relationFromEl);
            const [centerToX, centerToY] = getPointCenterCoords(relationToEl);

            const markerWidth = 7;
            const markerHeight = 7;

            const width = Math.max(centerX, centerToX) + markerWidth;
            const height = Math.max(centerY, centerToY) + markerHeight;

            const pointsPolyline = [
              `${centerX},${centerY}`,
              `${(centerX + centerToX) / 2},${(centerY + centerToY) / 2}`,
              `${centerToX},${centerToY}`
            ].join(' ');

            return (
              <svg
                key={bpRelationId}
                className={classes.svg}
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${width} ${height}`}
                width={width}
                height={height}
              >
                <defs>
                  <marker id="arrowhead" viewBox="0 0 10 10" refX="3" refY="5"
                  markerWidth={markerWidth} markerHeight={markerHeight} orient="auto">
                    <path fill="white" stroke="black" d="M 0 0 L 10 5 L 0 10 z" />
                  </marker>
                </defs>
                <g fill="none" stroke="black" strokeWidth="2" markerMid="url(#arrowhead)">
                  <polyline points={pointsPolyline} // d={`M ${centerX},${centerY} L ${centerToX},${centerToY}`}
                  />
                </g>
              </svg>
            );
          })
      }
    </div>
  );
}

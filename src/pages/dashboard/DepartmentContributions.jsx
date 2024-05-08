import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/auth-context'
import useHttp from '../../hooks/http-hook'

import styles from './DepartmentContributions.module.css'

function roundPercentage(decimalPercentage) {
    // Convert the decimal percentage to a string and remove the '%' symbol
    const percentageString = decimalPercentage.toString().replace('%', '')

    // Convert the string to a float, round it to the nearest integer, and convert it back to a string
    const roundedPercentage = parseFloat(percentageString).toFixed(0)

    // Add the '%' symbol back to the rounded percentage and return it
    return roundedPercentage + '%'
}

const DepartmentContributions = (props) => {
    const { contributions } = props

    const [total, setTotal] = useState(0)

    useEffect(() => {
        const compute = () => {
            let totalSum = 0
            contributions.forEach((obj) => {
                totalSum += obj.total
            })
            setTotal(totalSum)
        }

        if (contributions) compute()
    }, [contributions])

    return (
        <div className={styles['container']}>
            <h2>Contributions</h2>
            <div className={styles['contribution_container']}>
                {contributions &&
                    contributions?.map((contribution, index) => {
                        return (
                            <div className={styles['contribution']} key={index}>
                                <div className={styles['contribution_title']}>
                                    <div className={styles['title_container']}>
                                        <p className="title">
                                            {contribution.department.name}
                                        </p>
                                    </div>
                                    <span
                                        style={{
                                            background: 'var(--accent)',
                                            color: '#fff',
                                            borderRadius: '24px',
                                            padding: '4px 12px',
                                            fontWeight: 600,
                                            fontSize: '12px',
                                        }}
                                    >
                                        {total !== 0 || isNaN(total)
                                            ? `${roundPercentage(
                                                  (contribution.total / total) *
                                                      100
                                              )}`
                                            : `0%`}
                                    </span>
                                </div>
                                <div className={styles['status_container']}>
                                    <div className={styles['status']}>
                                        <div
                                            className={`${styles['color']} ${styles['unassigned']}`}
                                        >
                                            Unassigned
                                        </div>
                                        <div className={styles['line']}></div>
                                        <p className="title">
                                            {contribution.unassigned}
                                        </p>
                                    </div>
                                    <div className={styles['status']}>
                                        <div
                                            className={`${styles['color']} ${styles['ongoing']}`}
                                        >
                                            On-Going
                                        </div>
                                        <div className={styles['line']}></div>
                                        <p className="title">
                                            {contribution.ongoing}
                                        </p>
                                    </div>
                                    <div className={styles['status']}>
                                        <div
                                            className={`${styles['color']} ${styles['pending']}`}
                                        >
                                            Pending
                                        </div>
                                        <div className={styles['line']}></div>
                                        <p className="title">
                                            {contribution.pending}
                                        </p>
                                    </div>
                                    <div className={styles['status']}>
                                        <div
                                            className={`${styles['color']} ${styles['cancelled']}`}
                                        >
                                            Cancelled
                                        </div>
                                        <div className={styles['line']}></div>
                                        <p className="title">
                                            {contribution.cancelled}
                                        </p>
                                    </div>
                                    <div className={styles['status']}>
                                        <div
                                            className={`${styles['color']} ${styles['done']}`}
                                        >
                                            Done
                                        </div>
                                        <div className={styles['line']}></div>
                                        <p className="title">
                                            {contribution.done}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}

export default DepartmentContributions

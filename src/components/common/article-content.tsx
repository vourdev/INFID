import React, { useEffect, useState } from 'react';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export const ArticleContent = ({ content }: { content: string }) => {
    return (
        <article className='prose prose-slate xl:prose-base'>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    p: ({ children }) => {
                        const hasPreviewer = React.Children.toArray(children).some((child) => {
                            if (React.isValidElement(child)) {
                                const props = child.props as { href?: string };
                                return props.href?.toLowerCase().endsWith('.pdf');
                            }
                            return false;
                        });

                        return hasPreviewer ? <div className='mb-4'>{children}</div> : <p>{children}</p>;
                    },
                    a: ({ href, children }) => {
                        const isPdf = href?.toLowerCase().endsWith('.pdf');
                        const isDownloadButton = children === 'Download';

                        if (isPdf) {
                            if (isDownloadButton) {
                                return (
                                    <a
                                        href={href}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='ml-2 inline-flex items-center rounded bg-red-600 px-3 py-1 text-sm font-medium text-white no-underline transition-colors hover:bg-red-700'>
                                        {children}
                                    </a>
                                );
                            }
                            return <PdfPreviewer href={href ?? ''} label={children as string} />;
                        }

                        return (
                            <a href={href} target='_blank' rel='noopener noreferrer'>
                                {children}
                            </a>
                        );
                    }
                }}>
                {content}
            </ReactMarkdown>
        </article>
    );
};

const PdfPreviewer = ({ href, label }: { href: string; label: string }) => {
    return (
        <section className='not-prose my-6 overflow-hidden rounded-xl border bg-gray-50 shadow-sm'>
            <div className='flex items-center justify-between border-b bg-gray-100 px-4 py-2 font-sans text-sm'>
                <span className='truncate font-medium text-slate-700'>{label}</span>

                <a href={href} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
                    Full Screen
                </a>
            </div>

            <iframe src={`${href}#toolbar=0`} className='h-125 w-full border-none' title={label} onLoad={(e) => {}} />
        </section>
    );
};

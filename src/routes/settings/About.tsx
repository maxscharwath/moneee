import React from 'react';
import { Container } from '@/components/container';
import { Header, HeaderTitle } from '@/components/header';
import { abbreviatedSha, github } from '@build/info';
import { version, author, license } from '@build/package';
import now from '@build/time';
import { useLocale } from '@/i18n';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import {
    ChevronLeft,
    User,
    Calendar,
    Hash,
    Package,
    Bug,
    Code2Icon,
    Shield,
} from 'lucide-react';
import logo from '@/assets/logo.webp';
import * as List from '@/components/ui/list';
import { SettingItem } from '@/components/settings-item';

export const Component: React.FC = () => {
    const { t } = useLocale();

    return (
        <>
            <Header>
                <Button variant="ghost" size="icon" asChild>
                    <NavLink
                        to="/settings"
                        className="flex items-center gap-2 transition-transform hover:scale-105"
                        state={{ direction: 'left' }}
                    >
                        <ChevronLeft />
                    </NavLink>
                </Button>
                <HeaderTitle>{t('about.title')}</HeaderTitle>
            </Header>
            <Container>
                <div className="flex justify-center">
                    <div className="mb-4 aspect-square h-24 w-24 transform rounded-2xl bg-secondary p-2">
                        <img src={logo} alt="App Logo" draggable={false} />
                    </div>
                </div>

                <List.Root>
                    <List.List heading={t('about.details')}>
                        <SettingItem
                            icon={User}
                            color="#ff8a8a"
                            title={t('about.author')}
                            value={author.name}
                            href={`mailto:${author.email}`}
                        />
                        <SettingItem
                            icon={Package}
                            color="#66b2ff"
                            title={t('about.version')}
                            value={version}
                        />
                        <SettingItem
                            icon={Calendar}
                            color="#f5b583"
                            title={t('about.buildDate')}
                            value={now.toLocaleString()}
                        />
                        <SettingItem
                            icon={Hash}
                            color="#7a9e70"
                            title={t('about.buildHash')}
                            value={abbreviatedSha}
                        />
                        <SettingItem
                            icon={Shield}
                            color="#a8aeb3"
                            title={t('about.license')}
                            value={license}
                        />
                        {github && (
                            <>
                                <SettingItem
                                    icon={Code2Icon}
                                    color="#a8aeb3"
                                    title={t('about.repo')}
                                    href={github}
                                    chevron
                                />
                                <SettingItem
                                    icon={Bug}
                                    color="#e57373"
                                    title={t('about.reportBug')}
                                    href={`${github}/issues/new?template=bug_report.md`}
                                    chevron
                                />
                            </>
                        )}
                    </List.List>
                </List.Root>
            </Container>
        </>
    );
};

Component.displayName = 'Settings.About';

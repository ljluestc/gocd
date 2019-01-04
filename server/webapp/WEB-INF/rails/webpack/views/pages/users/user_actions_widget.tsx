/*
 * Copyright 2018 ThoughtWorks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {bind} from "classnames/bind";
import {MithrilComponent, MithrilViewComponent} from "jsx/mithril-component";
import * as m from "mithril";
import {Stream} from "mithril/stream";
import * as stream from "mithril/stream";
import {UserFilters} from "models/users/user_filters";
import {ButtonGroup, Cancel, Secondary} from "views/components/buttons";
import {CheckboxField, SearchField} from "views/components/forms/input_fields";
import {Attrs} from "views/pages/users/users_widget";
import * as styles from "./index.scss";

const classnames = bind(styles);

export interface State {
  toggleFiltersView: () => void;
  showFilters: Stream<boolean>;
}

export interface FiltersViewAttrs {
  showFilters: Stream<boolean>;
  userFilters: UserFilters;
}

export class FiltersView extends MithrilViewComponent<FiltersViewAttrs> {
  view(vnode: m.Vnode<FiltersViewAttrs>) {
    return <div data-test-id="filters-view"
                data-test-visible={`${vnode.attrs.showFilters()}`}
                class={classnames({hidden: !vnode.attrs.showFilters()}, styles.filterView)}>
      <span data-test-id="filter-by-header" class={styles.filterByHeader}>
        <h4 data-test-id="filter-by-heading" class={styles.filterByHeading}> Filter By </h4>
        <Cancel data-test-id="reset-filter-btn"
                onclick={vnode.attrs.userFilters.resetFilters.bind(vnode.attrs.userFilters)}>
          <u>Reset Filters</u>
        </Cancel>
      </span>
      <div>
        <div data-test-id="filter-by-privileges">
          <p data-test-id="filter-by-privileges-heading"> Privileges </p>
          <CheckboxField label="Super Administrators"
                         property={vnode.attrs.userFilters.superAdmins}/>
          <CheckboxField label="Normal Users"
                         property={vnode.attrs.userFilters.normalUsers}/>
        </div>
        <div data-test-id="filter-by-users-state">
          <p data-test-id="filter-by-users-state-heading"> User state </p>
          <CheckboxField label="Enabled"
                         property={vnode.attrs.userFilters.enabledUsers}/>
          <CheckboxField label="Disabled"
                         property={vnode.attrs.userFilters.disabledUsers}/>
        </div>
      </div>
    </div>;
  }
}

export class UsersActionsWidget extends MithrilComponent<Attrs, State> {
  oninit(vnode: m.Vnode<Attrs, State>) {
    vnode.state.showFilters = stream(false);

    vnode.state.toggleFiltersView = () => {
      vnode.state.showFilters(!vnode.state.showFilters());
    };
  }

  view(vnode: m.Vnode<Attrs, State>) {
    return <div>
      <span data-test-id="users-count">
        <div>Total: <span data-test-id="all-user-count">{vnode.attrs.users().totalUsersCount()}</span></div>
        <div>Enabled: <span data-test-id="enabled-user-count">{vnode.attrs.users().enabledUsersCount()}</span></div>
        <div>Disabled: <span data-test-id="disabled-user-count">{vnode.attrs.users().disabledUsersCount()}</span></div>
      </span>
      <ButtonGroup>
        <Secondary onclick={vnode.attrs.onEnable.bind(vnode.attrs, vnode.attrs.users())}
                   disabled={!vnode.attrs.users().anyUserSelected()}>Enable</Secondary>
        <Secondary onclick={vnode.attrs.onDisable.bind(vnode.attrs, vnode.attrs.users())}
                   disabled={!vnode.attrs.users().anyUserSelected()}>Disable</Secondary>
        <Secondary onclick={vnode.attrs.onDelete.bind(vnode.attrs, vnode.attrs.users())}
                   disabled={!vnode.attrs.users().anyUserSelected()}>Delete</Secondary>
      </ButtonGroup>
      <SearchField property={vnode.attrs.userFilter().searchText} dataTestId={"search-box"}/>
      <Secondary data-test-id="filters-btn" onclick={vnode.state.toggleFiltersView}>Filters</Secondary>
      <FiltersView showFilters={vnode.state.showFilters} userFilters={vnode.attrs.userFilter()}/>
    </div>;
  }
}